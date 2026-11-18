import { z } from 'zod'

export const transactionFormSchema = z.object({
  type: z.enum(['EXPENSE', 'INCOME']),
  description: z.string().trim().min(1, 'Informe a descrição'),
  date: z.date({ error: 'Selecione a data' }),
  amount: z.number({ error: 'Informe o valor' }).positive('Informe um valor maior que zero'),
  categoryId: z.string({ error: 'Selecione a categoria' }).min(1, 'Selecione a categoria'),
})

export type TransactionFormValues = z.infer<typeof transactionFormSchema>
