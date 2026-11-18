import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ quiet: true })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório'),
  CORS_ORIGIN: z.string().default('*'),

  /** Validade, em minutos, do código de redefinição de senha enviado por e-mail. */
  PASSWORD_RESET_CODE_TTL_MINUTES: z.coerce.number().int().positive().default(15),

  // SMTP (opcional em desenvolvimento: sem SMTP_HOST o link é exibido no console)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default('Financy <no-reply@financy.local>'),
}).refine((data) => data.NODE_ENV !== 'production' || !!data.SMTP_HOST, {
  message: 'SMTP_HOST é obrigatório em produção',
  path: ['SMTP_HOST'],
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:', z.flattenError(parsed.error).fieldErrors)
  process.exit(1)
}

export const env = parsed.data
