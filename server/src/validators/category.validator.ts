import { z } from 'zod'

const title = z.string().trim().min(1, 'O título é obrigatório').max(50, 'O título deve ter no máximo 50 caracteres')
const description = z.string().trim().max(200, 'A descrição deve ter no máximo 200 caracteres').nullish()
const icon = z.string().trim().min(1).max(50)
const color = z.string().trim().min(1).max(30)

export const createCategorySchema = z.object({
  title,
  description,
  icon: icon.optional(),
  color: color.optional(),
})

export const updateCategorySchema = z
  .object({
    title: title.optional(),
    description,
    icon: icon.optional(),
    color: color.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Informe ao menos um campo para atualizar',
  })

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
