import { z } from 'zod'

export const categoryFormSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título'),
  description: z.string().trim(),
  icon: z.string().min(1, 'Selecione um ícone'),
  color: z.string().min(1, 'Selecione uma cor'),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
