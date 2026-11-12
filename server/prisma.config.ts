import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Fallback permite rodar `prisma generate` (postinstall) antes de criar o .env
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
})
