import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'
import cors, { type CorsOptions } from 'cors'
import express from 'express'
import http from 'node:http'
import { env } from './env.js'
import { buildContext, type GraphQLContext } from './graphql/context.js'
import { resolvers } from './graphql/resolvers.js'
import { typeDefs } from './graphql/type-defs.js'
import { prisma } from './lib/prisma.js'

function buildCorsOptions(): CorsOptions {
  const origins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  return {
    origin: origins.includes('*') ? true : origins,
    credentials: true,
  }
}

async function bootstrap() {
  const app = express()
  const httpServer = http.createServer(app)

  const apollo = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: env.NODE_ENV !== 'production',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError, error) => {
      const code = formattedError.extensions?.code
      // Esconde detalhes de erros inesperados em produção
      if (env.NODE_ENV === 'production' && code === 'INTERNAL_SERVER_ERROR') {
        console.error(error)
        return { message: 'Erro interno do servidor', extensions: { code } }
      }
      return formattedError
    },
  })

  await apollo.start()

  app.use(cors(buildCorsOptions()))

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use(
    '/graphql',
    express.json({ limit: '1mb' }),
    expressMiddleware(apollo, { context: buildContext }),
  )

  await new Promise<void>((resolve) => httpServer.listen({ port: env.PORT }, resolve))
  console.log(`🚀 Financy API rodando em http://localhost:${env.PORT}/graphql`)

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} recebido, encerrando...`)
    await apollo.stop()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

bootstrap().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error)
  process.exit(1)
})
