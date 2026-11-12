import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'

function parseDate(value: unknown): Date {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new GraphQLError('DateTime deve ser uma string ISO 8601 ou timestamp', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new GraphQLError(`Data inválida: ${String(value)}`, {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }

  return date
}

export const DateTimeScalar = new GraphQLScalarType<Date, string>({
  name: 'DateTime',
  description: 'Data/hora no formato ISO 8601',
  serialize(value) {
    const date = value instanceof Date ? value : parseDate(value)
    return date.toISOString()
  },
  parseValue(value) {
    return parseDate(value)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return parseDate(ast.kind === Kind.INT ? Number(ast.value) : ast.value)
    }
    throw new GraphQLError('DateTime deve ser uma string ISO 8601 ou timestamp', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  },
})
