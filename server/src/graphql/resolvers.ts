import type { Category, Transaction } from '../generated/prisma/client.js'
import { fromCents } from '../lib/money.js'
import { requireAuth, type GraphQLContext } from './context.js'
import { DateTimeScalar } from './scalars/date-time.js'

type IdArgs = { id: string }
type DataArgs = { data: unknown }
type IdDataArgs = { id: string; data: unknown }
type FilterArgs = { filter?: unknown }

export const resolvers = {
  DateTime: DateTimeScalar,

  Query: {
    me: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      ctx.services.auth.me(requireAuth(ctx)),

    categories: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      ctx.services.category.list(requireAuth(ctx)),

    category: (_: unknown, { id }: IdArgs, ctx: GraphQLContext) =>
      ctx.services.category.findById(requireAuth(ctx), id),

    transactions: (_: unknown, { filter }: FilterArgs, ctx: GraphQLContext) =>
      ctx.services.transaction.list(requireAuth(ctx), filter),

    transaction: (_: unknown, { id }: IdArgs, ctx: GraphQLContext) =>
      ctx.services.transaction.findById(requireAuth(ctx), id),

    summary: async (_: unknown, { filter }: FilterArgs, ctx: GraphQLContext) => {
      const { totalIncomeCents, totalExpenseCents } = await ctx.services.transaction.summary(
        requireAuth(ctx),
        filter,
      )
      return {
        totalIncome: fromCents(totalIncomeCents),
        totalExpense: fromCents(totalExpenseCents),
        balance: fromCents(totalIncomeCents - totalExpenseCents),
      }
    },
  },

  Mutation: {
    register: (_: unknown, { data }: DataArgs, ctx: GraphQLContext) =>
      ctx.services.auth.register(data),

    login: (_: unknown, { data }: DataArgs, ctx: GraphQLContext) =>
      ctx.services.auth.login(data),

    createCategory: (_: unknown, { data }: DataArgs, ctx: GraphQLContext) =>
      ctx.services.category.create(requireAuth(ctx), data),

    updateCategory: async (_: unknown, { id, data }: IdDataArgs, ctx: GraphQLContext) => {
      const category = await ctx.services.category.update(requireAuth(ctx), id, data)
      ctx.loaders.categoryById.clear(id)
      return category
    },

    deleteCategory: async (_: unknown, { id }: IdArgs, ctx: GraphQLContext) => {
      const deleted = await ctx.services.category.delete(requireAuth(ctx), id)
      ctx.loaders.categoryById.clear(id)
      return deleted
    },

    createTransaction: async (_: unknown, { data }: DataArgs, ctx: GraphQLContext) => {
      const transaction = await ctx.services.transaction.create(requireAuth(ctx), data)
      ctx.loaders.categoryStats.clearAll()
      return transaction
    },

    updateTransaction: async (_: unknown, { id, data }: IdDataArgs, ctx: GraphQLContext) => {
      const transaction = await ctx.services.transaction.update(requireAuth(ctx), id, data)
      ctx.loaders.categoryStats.clearAll()
      return transaction
    },

    deleteTransaction: async (_: unknown, { id }: IdArgs, ctx: GraphQLContext) => {
      const deleted = await ctx.services.transaction.delete(requireAuth(ctx), id)
      ctx.loaders.categoryStats.clearAll()
      return deleted
    },
  },

  Category: {
    transactionsCount: async (parent: Category, _: unknown, ctx: GraphQLContext) =>
      (await ctx.loaders.categoryStats.load(parent.id)).count,

    totalAmount: async (parent: Category, _: unknown, ctx: GraphQLContext) =>
      fromCents((await ctx.loaders.categoryStats.load(parent.id)).totalCents),
  },

  Transaction: {
    amount: (parent: Transaction) => fromCents(parent.amount),

    category: (parent: Transaction, _: unknown, ctx: GraphQLContext) =>
      parent.categoryId ? ctx.loaders.categoryById.load(parent.categoryId) : null,
  },
}
