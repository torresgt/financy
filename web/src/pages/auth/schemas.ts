import { z } from 'zod'

/**
 * Regras espelhadas de `server/src/validators/auth.validator.ts`, para
 * o usuário ver o erro antes de ir ao servidor.
 */
const email = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail')
  .toLowerCase()
  .pipe(z.email('E-mail inválido'))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe a senha'),
  remember: z.boolean(),
})

const password = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .max(72, 'A senha deve ter no máximo 72 caracteres')

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  email,
  password,
})

export const recoverPasswordSchema = z
  .object({
    email,
    newPassword: password,
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export const resetCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Informe o código de 6 dígitos'),
})

export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>
export type ResetCodeFormValues = z.infer<typeof resetCodeSchema>
