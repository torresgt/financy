import type { SelectOption } from '@/components/ui/select'
import type { CategorySummaryItem, RecentTransactionItem } from '../types'

/** Resumo financeiro mockado até a integração com a API (`GET_SUMMARY`). */
export const SUMMARY_MOCK = {
  balance: 12847.32,
  monthIncome: 4250.0,
  monthExpense: 2180.45,
}

export const RECENT_TRANSACTIONS: RecentTransactionItem[] = [
  {
    id: '1',
    description: 'Pagamento de Salário',
    date: '01/12/25',
    category: 'Receita',
    color: 'green',
    icon: 'briefcase-business',
    amount: 4250.0,
    type: 'INCOME',
  },
  {
    id: '2',
    description: 'Jantar no Restaurante',
    date: '30/11/25',
    category: 'Alimentação',
    color: 'blue',
    icon: 'utensils',
    amount: 89.5,
    type: 'EXPENSE',
  },
  {
    id: '3',
    description: 'Posto de Gasolina',
    date: '29/11/25',
    category: 'Transporte',
    color: 'purple',
    icon: 'car-front',
    amount: 100.0,
    type: 'EXPENSE',
  },
  {
    id: '4',
    description: 'Compras no Mercado',
    date: '28/11/25',
    category: 'Mercado',
    color: 'orange',
    icon: 'shopping-cart',
    amount: 156.8,
    type: 'EXPENSE',
  },
  {
    id: '5',
    description: 'Retorno de Investimento',
    date: '26/11/25',
    category: 'Investimento',
    color: 'green',
    icon: 'piggy-bank',
    amount: 340.25,
    type: 'INCOME',
  },
]

export const CATEGORIES_SUMMARY: CategorySummaryItem[] = [
  { id: '1', title: 'Alimentação', color: 'blue', itemsCount: 12, totalAmount: 542.3 },
  { id: '2', title: 'Transporte', color: 'purple', itemsCount: 8, totalAmount: 385.5 },
  { id: '3', title: 'Mercado', color: 'orange', itemsCount: 3, totalAmount: 298.75 },
  { id: '4', title: 'Entretenimento', color: 'pink', itemsCount: 2, totalAmount: 186.2 },
  { id: '5', title: 'Utilidades', color: 'yellow', itemsCount: 7, totalAmount: 245.8 },
]

/** Opções de categoria para o modal de Nova transação. */
export const CATEGORY_OPTIONS: SelectOption[] = CATEGORIES_SUMMARY.map((category) => ({
  value: category.id,
  label: category.title,
}))
