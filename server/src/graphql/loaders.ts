import DataLoader from 'dataloader'
import type { Category, PrismaClient } from '../generated/prisma/client.js'

export interface CategoryStats {
  count: number
  totalCents: number
}

/**
 * DataLoaders criados por requisição para evitar o problema de N+1
 * ao resolver campos relacionados (ex.: `Transaction.category`).
 * Todas as consultas são restritas ao usuário autenticado.
 */
export function createLoaders(prisma: PrismaClient, userId: string | null) {
  const categoryById = new DataLoader<string, Category | null>(async (ids) => {
    if (!userId) return ids.map(() => null)

    const categories = await prisma.category.findMany({
      where: { id: { in: [...ids] }, userId },
    })
    const byId = new Map(categories.map((category) => [category.id, category]))
    return ids.map((id) => byId.get(id) ?? null)
  })

  const categoryStats = new DataLoader<string, CategoryStats>(async (ids) => {
    if (!userId) return ids.map(() => ({ count: 0, totalCents: 0 }))

    const groups = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { categoryId: { in: [...ids] }, userId },
      _count: { _all: true },
      _sum: { amount: true },
    })
    const byId = new Map(
      groups.map((group) => [
        group.categoryId,
        { count: group._count._all, totalCents: group._sum.amount ?? 0 },
      ]),
    )
    return ids.map((id) => byId.get(id) ?? { count: 0, totalCents: 0 })
  })

  return { categoryById, categoryStats }
}

export type Loaders = ReturnType<typeof createLoaders>
