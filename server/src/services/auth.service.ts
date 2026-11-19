import { env } from '../env.js'
import { ConflictError, UnauthenticatedError, ValidationError } from '../errors/app-error.js'
import type { PrismaClient, User } from '../generated/prisma/client.js'
import {
  comparePassword,
  generatePasswordResetCode,
  hashPassword,
  signToken,
} from '../lib/auth.js'
import { passwordResetCodeEmail } from '../emails/password-reset-code.js'
import { sendMail } from '../lib/mailer.js'
import {
  confirmPasswordResetSchema,
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  updateProfileSchema,
} from '../validators/auth.validator.js'
import { validate } from '../validators/validate.js'

export interface AuthResult {
  token: string
  user: User
}

/** Tentativas de código erradas permitidas antes de invalidar o pedido. */
const MAX_RESET_CODE_ATTEMPTS = 5

/**
 * Mesma mensagem para e-mail inexistente, código errado, expirado ou bloqueado,
 * para não revelar quais e-mails estão cadastrados.
 */
const INVALID_RESET_CODE_MESSAGE = 'Código inválido ou expirado'

/** Hash bcrypt descartável, usado para igualar o tempo de resposta quando não há pedido. */
const dummyHashPromise = hashPassword('financy-dummy-reset-code')

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(input: unknown): Promise<AuthResult> {
    const data = validate(registerSchema, input)

    const existing = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      throw new ConflictError('Já existe uma conta com este e-mail')
    }

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password),
      },
    })

    return { token: signToken(user.id), user }
  }

  async login(input: unknown): Promise<AuthResult> {
    const data = validate(loginSchema, input)

    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    const passwordMatches = user ? await comparePassword(data.password, user.password) : false

    if (!user || !passwordMatches) {
      throw new UnauthenticatedError('E-mail ou senha inválidos')
    }

    return { token: signToken(user.id), user }
  }

  /**
   * Etapa 1: recebe e-mail + nova senha. Sempre retorna `true`, exista ou não a
   * conta, e faz o trabalho em segundo plano, para que nem a resposta nem o
   * tempo de resposta revelem quais e-mails estão cadastrados. Se a conta
   * existir, a nova senha fica pendente e um código de 6 dígitos é enviado.
   */
  async requestPasswordReset(input: unknown): Promise<boolean> {
    const { email, newPassword } = validate(requestPasswordResetSchema, input)

    void this.issuePasswordReset(email, newPassword).catch((error) => {
      console.error('Falha ao processar a recuperação de senha:', error)
    })

    return true
  }

  /** Etapa 2: o código recebido por e-mail confirma o pedido e aplica a nova senha. */
  async confirmPasswordReset(input: unknown): Promise<boolean> {
    const { email, code } = validate(confirmPasswordResetSchema, input)
    const invalid = () =>
      new ValidationError(INVALID_RESET_CODE_MESSAGE, { code: [INVALID_RESET_CODE_MESSAGE] })

    // Pedido ativo: não usado, dentro da validade e abaixo do limite de tentativas.
    const activeWhere = {
      usedAt: null,
      expiresAt: { gt: new Date() },
      attempts: { lt: MAX_RESET_CODE_ATTEMPTS },
    }

    const resetRequest = await this.prisma.passwordResetToken.findFirst({
      where: { ...activeWhere, user: { email } },
      orderBy: { createdAt: 'desc' },
    })

    if (!resetRequest) {
      await comparePassword(code, await dummyHashPromise)
      throw invalid()
    }

    if (!(await comparePassword(code, resetRequest.codeHash))) {
      await this.prisma.passwordResetToken.updateMany({
        where: { id: resetRequest.id, ...activeWhere },
        data: { attempts: { increment: 1 } },
      })
      throw invalid()
    }

    await this.prisma.$transaction(async (tx) => {
      // Consome o pedido de forma atômica: só um uso, mesmo com requisições simultâneas.
      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: resetRequest.id, ...activeWhere },
        data: { usedAt: new Date() },
      })
      if (consumed.count !== 1) {
        throw invalid()
      }

      await tx.user.update({
        where: { id: resetRequest.userId },
        data: { password: resetRequest.newPasswordHash },
      })

      await tx.passwordResetToken.deleteMany({
        where: { userId: resetRequest.userId, id: { not: resetRequest.id } },
      })
    })

    return true
  }

  async me(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new UnauthenticatedError('Usuário não encontrado')
    }
    return user
  }

  /** Atualiza os dados do perfil do usuário autenticado (o e-mail não pode ser alterado). */
  async updateProfile(userId: string, input: unknown): Promise<User> {
    const data = validate(updateProfileSchema, input)
    await this.me(userId)

    return this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    })
  }

  private async issuePasswordReset(email: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return

    // Evita "bombardear" a caixa do usuário (e a reputação do remetente) com
    // pedidos seguidos: dentro do intervalo, o código já enviado continua valendo.
    const cooldownMs = env.PASSWORD_RESET_RESEND_COOLDOWN_SECONDS * 1_000
    const recentRequest = await this.prisma.passwordResetToken.findFirst({
      where: { userId: user.id, usedAt: null, createdAt: { gt: new Date(Date.now() - cooldownMs) } },
      select: { id: true },
    })
    if (recentRequest) return

    const code = generatePasswordResetCode()
    const [codeHash, newPasswordHash] = await Promise.all([
      hashPassword(code),
      hashPassword(newPassword),
    ])
    const ttlMinutes = env.PASSWORD_RESET_CODE_TTL_MINUTES

    // Um código válido por vez: o pedido mais recente substitui os anteriores.
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      this.prisma.passwordResetToken.create({
        data: {
          codeHash,
          newPasswordHash,
          userId: user.id,
          expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
        },
      }),
    ])

    await sendMail({
      to: user.email,
      ...passwordResetCodeEmail({ name: user.name, code, ttlMinutes }),
    })
  }
}
