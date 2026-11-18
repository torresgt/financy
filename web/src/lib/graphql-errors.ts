import { CombinedGraphQLErrors } from '@apollo/client'

const NETWORK_ERROR_MESSAGE = 'Não foi possível conectar ao servidor. Tente novamente.'

/** Mensagem amigável para exibir ao usuário a partir de um erro do Apollo. */
export function getErrorMessage(error: unknown, fallback = NETWORK_ERROR_MESSAGE): string {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors[0]?.message ?? fallback
  }
  return fallback
}

/**
 * Erros por campo enviados pelo servidor em `extensions.fieldErrors`
 * (código `BAD_USER_INPUT`). Retorna a primeira mensagem de cada campo.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!CombinedGraphQLErrors.is(error)) return {}

  const result: Record<string, string> = {}

  for (const err of error.errors) {
    if (err.extensions?.code !== 'BAD_USER_INPUT') continue

    const fieldErrors = err.extensions.fieldErrors as Record<string, string[] | undefined> | undefined
    for (const [field, messages] of Object.entries(fieldErrors ?? {})) {
      if (messages?.[0]) result[field] = messages[0]
    }
  }

  return result
}
