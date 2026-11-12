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
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:', z.flattenError(parsed.error).fieldErrors)
  process.exit(1)
}

export const env = parsed.data
