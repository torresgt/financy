import { NotFoundError } from '../errors/app-error.js'
import type { Prisma, PrismaClient, Transaction } from '../generated/prisma/client.js'
import { toCents } from '../lib/money.js'
import {
  createTransactionSchema,
  transactionFilterSchema,
  updateTransactionSchema,
  type TransactionFilterInput,
} from '../validators/transaction.validator.js'
import { validate } from '../validators/validate.js'

export interface SummaryResult {
  totalIncomeCents: number
  totalExpenseCents: number
}

export class TransactionService {
  constructor(private readonly prisma: PrismaClient) {}

  list(userId: string, filter?: unknown): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: this.buildWhere(userId, filter),
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async findById(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({ where: { id, userId } })
    if (!transaction) {
      throw new NotFoundError('Transação')
    }
    return transaction
  }

  async create(userId: string, input: unknown): Promise<Transaction> {
    const data = validate(createTransactionSchema, input)

    if (data.categoryId) {
      await this.ensureCategoryBelongsToUser(userId, data.categoryId)
    }

    return this.prisma.transaction.create({
      data: {
        description: data.description,
        amount: toCents(data.amount),
        type: data.type,
        date: data.date,
        categoryId: data.categoryId ?? null,
        userId,
      },
    })
  }

  async update(userId: string, id: string, input: unknown): Promise<Transaction> {
    const data = validate(updateTransactionSchema, input)
    const transaction = await this.findById(userId, id)

    if (data.categoryId) {
      await this.ensureCategoryBelongsToUser(userId, data.categoryId)
    }

    return this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        description: data.description,
        amount: data.amount !== undefined ? toCents(data.amount) : undefined,
        type: data.type,
        date: data.date,
        // `undefined` mantém a categoria atual; `null` remove o vínculo
        categoryId: data.categoryId,
      },
    })
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const transaction = await this.findById(userId, id)
    await this.prisma.transaction.delete({ where: { id: transaction.id } })
    return true
  }

  async summary(userId: string, filter?: unknown): Promise<SummaryResult> {
    const groups = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: this.buildWhere(userId, filter),
      _sum: { amount: true },
    })

    const totalOf = (type: 'INCOME' | 'EXPENSE') =>
      groups.find((group) => group.type === type)?._sum.amount ?? 0

    return {
      totalIncomeCents: totalOf('INCOME'),
      totalExpenseCents: totalOf('EXPENSE'),
    }
  }

  private buildWhere(userId: string, rawFilter?: unknown): Prisma.TransactionWhereInput {
    const filter: TransactionFilterInput = rawFilter
      ? validate(transactionFilterSchema, rawFilter)
      : {}

    return {
      userId,
      ...(filter.search ? { description: { contains: filter.search } } : {}),
      ...(filter.type ? { type: filter.type } : {}),
      ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
      ...(filter.startDate || filter.endDate
        ? {
            date: {
              ...(filter.startDate ? { gte: filter.startDate } : {}),
              ...(filter.endDate ? { lte: filter.endDate } : {}),
            },
          }
        : {}),
    }
  }

  private async ensureCategoryBelongsToUser(userId: string, categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
      select: { id: true },
    })
    if (!category) {
      throw new NotFoundError('Categoria')
    }
  }
}
