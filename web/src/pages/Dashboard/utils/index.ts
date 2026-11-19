import { endOfMonth, startOfMonth } from 'date-fns'
import { formatDate, toApiDate } from '@/lib/format'
import type { Category, Transaction, TransactionFilterInput } from '@/types/api'
import { CATEGORIES_OVERVIEW_LIMIT, RECENT_TRANSACTIONS_LIMIT } from '../constants'
import type { CategorySummaryItem, RecentTransactionItem } from '../types'

/** Filtro do primeiro ao último dia do mês da data informada (padrão: hoje). */
export function getMonthFilter(reference = new Date()): TransactionFilterInput {
  return {
    startDate: toApiDate(startOfMonth(reference)),
    endDate: toApiDate(endOfMonth(reference)),
  }
}

export function toRecentTransactions(transactions: Transaction[]): RecentTransactionItem[] {
  return transactions.slice(0, RECENT_TRANSACTIONS_LIMIT).map((transaction) => ({
    id: transaction.id,
    description: transaction.description,
    date: formatDate(transaction.date),
    category: transaction.category?.title ?? 'Sem categoria',
    color: transaction.category?.color ?? 'gray',
    icon: transaction.category?.icon ?? 'tag',
    amount: transaction.amount,
    type: transaction.type,
  }))
}

/** Categorias com transações, da que mais movimentou para a que menos movimentou. */
export function toCategoriesOverview(categories: Category[]): CategorySummaryItem[] {
  return categories
    .filter((category) => category.transactionsCount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, CATEGORIES_OVERVIEW_LIMIT)
    .map((category) => ({
      id: category.id,
      title: category.title,
      color: category.color,
      itemsCount: category.transactionsCount,
      totalAmount: category.totalAmount,
    }))
}
