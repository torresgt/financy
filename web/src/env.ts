import { z } from 'zod'

const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:', z.treeifyError(parsed.error))
  throw new Error('Variáveis de ambiente inválidas. Confira o arquivo .env (veja .env.example).')
}

export const env = parsed.data
