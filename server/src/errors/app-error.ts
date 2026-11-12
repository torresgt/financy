import { GraphQLError } from 'graphql'

/**
 * Erros de domínio expostos ao cliente com um `code` padronizado
 * em `extensions`, facilitando o tratamento no front-end.
 */
export class AppError extends GraphQLError {
  constructor(message: string, code: string, extra: Record<string, unknown> = {}) {
    super(message, { extensions: { code, ...extra } })
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message = 'Você precisa estar autenticado') {
    super(message, 'UNAUTHENTICATED', { http: { status: 401 } })
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado(a)`, 'NOT_FOUND', { http: { status: 404 } })
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', { http: { status: 409 } })
  }
}

export class ValidationError extends AppError {
  constructor(message: string, fieldErrors: Record<string, string[] | undefined> = {}) {
    super(message, 'BAD_USER_INPUT', { fieldErrors, http: { status: 400 } })
  }
}
