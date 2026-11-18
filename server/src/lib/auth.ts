import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'node:crypto'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../env.js'

const SALT_ROUNDS = 10

export interface TokenPayload {
  sub: string
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  })
}

/** Gera um token aleatório (256 bits) para o link de redefinição e o seu hash. */
export function generatePasswordResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('base64url')
  return { token, tokenHash: hashPasswordResetToken(token) }
}

/** SHA-256 do token: é o que fica no banco, nunca o valor original. */
export function hashPasswordResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/** Retorna o id do usuário se o token for válido, ou `null` caso contrário. */
export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    if (typeof payload === 'object' && typeof payload.sub === 'string') {
      return payload.sub
    }
    return null
  } catch {
    return null
  }
}
