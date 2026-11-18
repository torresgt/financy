import { env } from '../env.js'
import { ConflictError, UnauthenticatedError, ValidationError } from '../errors/app-error.js'
import type { PrismaClient, User } from '../generated/prisma/client.js'
import {
  comparePassword,
  generatePasswordResetToken,
  hashPassword,
  hashPasswordResetToken,
  signToken,
} from '../lib/auth.js'
import { sendMail } from '../lib/mailer.js'
import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js'
import { validate } from '../validators/validate.js'

export interface AuthResult {
  token: string
  user: User
}

const INVALID_RESET_TOKEN_MESSAGE =
  'Link de recuperação inválido ou expirado. Solicite um novo link.'

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
   * Etapa 1 da recuperação de senha. Sempre retorna `true`, exista ou não a
   * conta, e faz o trabalho em segundo plano, para que nem a resposta nem o
   * tempo de resposta revelem quais e-mails estão cadastrados.
   */
  async requestPasswordReset(input: unknown): Promise<boolean> {
    const { email } = validate(requestPasswordResetSchema, input)

    void this.issuePasswordReset(email).catch((error) => {
      console.error('Falha ao processar a recuperação de senha:', error)
    })

    return true
  }

  /** Etapa 2: valida o token do link e define a nova senha. */
  async resetPassword(input: unknown): Promise<boolean> {
    const data = validate(resetPasswordSchema, input)
    const tokenHash = hashPasswordResetToken(data.token)
    const passwordHash = await hashPassword(data.newPassword)

    await this.prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findUnique({ where: { tokenHash } })
      if (!resetToken) {
        throw new ValidationError(INVALID_RESET_TOKEN_MESSAGE)
      }

      // Consome o token de forma atômica: só um uso, e apenas dentro da validade.
      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: resetToken.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      })
      if (consumed.count !== 1) {
        throw new ValidationError(INVALID_RESET_TOKEN_MESSAGE)
      }

      await tx.user.update({
        where: { id: resetToken.userId },
        data: { password: passwordHash },
      })

      // Invalida qualquer outro link pendente do mesmo usuário.
      await tx.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId, id: { not: resetToken.id } },
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

  private async issuePasswordReset(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return

    const { token, tokenHash } = generatePasswordResetToken()
    const ttlMinutes = env.PASSWORD_RESET_TOKEN_TTL_MINUTES

    // Um link válido por vez: o pedido mais recente substitui os anteriores.
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      this.prisma.passwordResetToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
        },
      }),
    ])

    const link = new URL('/redefinir-senha', env.APP_URL)
    link.searchParams.set('token', token)

    await sendMail({
      to: user.email,
      subject: 'Financy - Redefinição de senha',
      text: [
        `Olá, ${user.name}!`,
        '',
        'Recebemos uma solicitação para redefinir a senha da sua conta no Financy.',
        `Para criar uma nova senha, acesse o link abaixo (válido por ${ttlMinutes} minutos):`,
        '',
        link.toString(),
        '',
        'Se você não fez essa solicitação, ignore este e-mail. Sua senha continua a mesma.',
      ].join('\n'),
      html: `
        <p>Olá, ${escapeHtml(user.name)}!</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta no Financy.</p>
        <p>
          <a href="${escapeHtml(link.toString())}">Clique aqui para criar uma nova senha</a>
          (válido por ${ttlMinutes} minutos).
        </p>
        <p>Se você não fez essa solicitação, ignore este e-mail. Sua senha continua a mesma.</p>
      `,
    })
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
