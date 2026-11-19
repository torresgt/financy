import { endOfMonth, format, parse, startOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { SelectOption } from '@/components/ui/select'
import { formatDate, toApiDate } from '@/lib/format'
import type { Transaction, TransactionFilterInput } from '@/types/api'
import { ALL_PERIODS_OPTION, PERIOD_MONTHS } from '../constants'
import type { TransactionFilters, TransactionRowItem } from '../types'

const PERIOD_KEY_FORMAT = 'yyyy-MM'

/** Chave do mês ("yyyy-MM") usada no filtro de período. */
export function toPeriodKey(date: Date) {
  return format(date, PERIOD_KEY_FORMAT)
}

/** Mês atual e os anteriores (ex.: "Novembro / 2026"), mais "Todo o período". */
export function getPeriodOptions(reference = new Date()): SelectOption[] {
  const months = Array.from({ length: PERIOD_MONTHS }, (_, index) => {
    const month = subMonths(reference, index)
    const label = format(month, "MMMM '/' yyyy", { locale: ptBR })
    return { value: toPeriodKey(month), label: label.charAt(0).toUpperCase() + label.slice(1) }
  })
  return [...months, ALL_PERIODS_OPTION]
}

export function getInitialFilters(): TransactionFilters {
  return { search: '', type: 'ALL', category: 'ALL', period: toPeriodKey(new Date()) }
}

/** Converte os filtros da tela no filtro aceito pela API. */
export function toApiFilter(filters: TransactionFilters): TransactionFilterInput {
  const filter: TransactionFilterInput = {}
  const search = filters.search.trim()

  if (search) filter.search = search
  if (filters.type !== 'ALL') filter.type = filters.type
  if (filters.category !== 'ALL') filter.categoryId = filters.category

  if (filters.period !== 'ALL') {
    const month = parse(filters.period, PERIOD_KEY_FORMAT, new Date())
    filter.startDate = toApiDate(startOfMonth(month))
    filter.endDate = toApiDate(endOfMonth(month))
  }

  return filter
}

export function toRowItem(transaction: Transaction): TransactionRowItem {
  return {
    id: transaction.id,
    description: transaction.description,
    date: formatDate(transaction.date),
    category: transaction.category?.title ?? 'Sem categoria',
    color: transaction.category?.color ?? 'gray',
    icon: transaction.category?.icon ?? 'tag',
    type: transaction.type,
    amount: transaction.amount,
  }
}
