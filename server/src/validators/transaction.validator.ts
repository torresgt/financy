import { z } from 'zod'

const description = z
  .string()
  .trim()
  .min(1, 'A descrição é obrigatória')
  .max(120, 'A descrição deve ter no máximo 120 caracteres')
const amount = z
  .number({ error: 'O valor deve ser numérico' })
  .positive('O valor deve ser maior que zero')
  .max(1_000_000_000, 'Valor muito alto')
const type = z.enum(['INCOME', 'EXPENSE'], { error: 'Tipo deve ser INCOME ou EXPENSE' })
const date = z.date({ error: 'Data inválida' })
const categoryId = z.string().min(1).nullish()

export const createTransactionSchema = z.object({
  description,
  amount,
  type,
  date,
  categoryId,
})

export const updateTransactionSchema = z
  .object({
    description: description.optional(),
    amount: amount.optional(),
    type: type.optional(),
    date: date.optional(),
    categoryId,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Informe ao menos um campo para atualizar',
  })

export const transactionFilterSchema = z
  .object({
    search: z.string().trim().max(120).nullish(),
    type: type.nullish(),
    categoryId: z.string().min(1).nullish(),
    startDate: date.nullish(),
    endDate: date.nullish(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.startDate <= data.endDate, {
    message: 'A data inicial deve ser anterior à data final',
    path: ['startDate'],
  })

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>
