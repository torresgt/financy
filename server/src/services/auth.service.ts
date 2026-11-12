import { ConflictError, UnauthenticatedError } from '../errors/app-error.js'
import type { PrismaClient, User } from '../generated/prisma/client.js'
import { comparePassword, hashPassword, signToken } from '../lib/auth.js'
import { loginSchema, registerSchema } from '../validators/auth.validator.js'
import { validate } from '../validators/validate.js'

export interface AuthResult {
  token: string
  user: User
}

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

  async me(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new UnauthenticatedError('Usuário não encontrado')
    }
    return user
  }
}
