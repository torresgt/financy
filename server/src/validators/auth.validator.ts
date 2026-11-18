import { z } from 'zod'

const email = z.string().trim().toLowerCase().pipe(z.email('E-mail inválido'))

const password = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .max(72, 'A senha deve ter no máximo 72 caracteres')

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres').max(100),
  email,
  password,
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe a senha'),
})

export const requestPasswordResetSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, 'Link de recuperação inválido'),
    newPassword: password,
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
