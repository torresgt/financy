import { z } from 'zod'
import { ValidationError } from '../errors/app-error.js'

/** Valida `input` com o schema zod e lança um erro GraphQL amigável em caso de falha. */
export function validate<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input)

  if (!result.success) {
    const { fieldErrors, formErrors } = z.flattenError(result.error)
    const firstMessage = result.error.issues[0]?.message ?? 'Dados inválidos'
    throw new ValidationError(firstMessage, {
      ...(fieldErrors as Record<string, string[] | undefined>),
      ...(formErrors.length ? { _form: formErrors } : {}),
    })
  }

  return result.data
}
