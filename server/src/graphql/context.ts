import type { Request } from 'express'
import { UnauthenticatedError } from '../errors/app-error.js'
import { verifyToken } from '../lib/auth.js'
import { prisma } from '../lib/prisma.js'
import { AuthService } from '../services/auth.service.js'
import { CategoryService } from '../services/category.service.js'
import { TransactionService } from '../services/transaction.service.js'
import { createLoaders, type Loaders } from './loaders.js'

const services = {
  auth: new AuthService(prisma),
  category: new CategoryService(prisma),
  transaction: new TransactionService(prisma),
}

export type Services = typeof services

export interface GraphQLContext {
  userId: string | null
  services: Services
  loaders: Loaders
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization
  if (!header) return null

  const [scheme, token] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null

  return token
}

export async function buildContext({ req }: { req: Request }): Promise<GraphQLContext> {
  const token = extractToken(req)
  const userId = token ? verifyToken(token) : null

  return {
    userId,
    services,
    loaders: createLoaders(prisma, userId),
  }
}

/** Garante que existe um usuário autenticado e retorna o seu id. */
export function requireAuth(ctx: GraphQLContext): string {
  if (!ctx.userId) {
    throw new UnauthenticatedError()
  }
  return ctx.userId
}
