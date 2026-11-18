import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AppLayout } from '@/components/app-layout'
import { CategoryIconBox, type CategoryIconName } from '@/components/category-icon'
import { NewTransactionDialog } from '@/components/new-transaction-dialog'
import { TextLink, TextLinkButton } from '@/components/ui/link'
import { Tag, type CategoryColor } from '@/components/ui/tag'
import { formatCurrency } from '@/lib/format'
import type { TransactionType } from '@/types/api'

interface RecentTransactionItem {
  id: string
  description: string
  date: string
  category: string
  color: CategoryColor
  icon: CategoryIconName
  amount: number
  type: TransactionType
}

interface CategorySummaryItem {
  id: string
  title: string
  color: CategoryColor
  itemsCount: number
  totalAmount: number
}

const RECENT_TRANSACTIONS: RecentTransactionItem[] = [
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

const CATEGORIES_SUMMARY: CategorySummaryItem[] = [
  { id: '1', title: 'Alimentação', color: 'blue', itemsCount: 12, totalAmount: 542.3 },
  { id: '2', title: 'Transporte', color: 'purple', itemsCount: 8, totalAmount: 385.5 },
  { id: '3', title: 'Mercado', color: 'orange', itemsCount: 3, totalAmount: 298.75 },
  { id: '4', title: 'Entretenimento', color: 'pink', itemsCount: 2, totalAmount: 186.2 },
  { id: '5', title: 'Utilidades', color: 'yellow', itemsCount: 7, totalAmount: 245.8 },
]

export function DashboardPage() {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card: Saldo total */}
        <div className="flex flex-col gap-4 rounded-[12px] border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Wallet className="size-5 shrink-0 text-purple-base" />
            <span className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
              Saldo total
            </span>
          </div>
          <p className="text-[28px] leading-8 font-bold text-gray-800">
            {formatCurrency(12847.32)}
          </p>
        </div>

        {/* Card: Receitas do mês */}
        <div className="flex flex-col gap-4 rounded-[12px] border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <CircleArrowUp className="size-5 shrink-0 text-brand-base" />
            <span className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
              Receitas do mês
            </span>
          </div>
          <p className="text-[28px] leading-8 font-bold text-gray-800">
            {formatCurrency(4250.0)}
          </p>
        </div>

        {/* Card: Despesas do mês */}
        <div className="flex flex-col gap-4 rounded-[12px] border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <CircleArrowDown className="size-5 shrink-0 text-red-base" />
            <span className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
              Despesas do mês
            </span>
          </div>
          <p className="text-[28px] leading-8 font-bold text-gray-800">
            {formatCurrency(2180.45)}
          </p>
        </div>

        {/* Section: Transações recentes */}
        <section className="flex flex-col self-start overflow-hidden rounded-[12px] border border-gray-200 bg-white lg:col-span-2">
          <header className="flex items-center justify-between border-b border-gray-200 py-5 pr-3 pl-6">
            <h2 className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
              Transações recentes
            </h2>
            <TextLink to="/transacoes">
              Ver todas
              <ChevronRight className="size-5" />
            </TextLink>
          </header>

          <div className="flex flex-col">
            {RECENT_TRANSACTIONS.map((transaction) => {
              const isIncome = transaction.type === 'INCOME'

              return (
                <div
                  key={transaction.id}
                  className="flex items-center border-b border-gray-200"
                >
                  <div className="flex h-20 min-w-0 flex-1 items-center gap-4 px-6">
                    <CategoryIconBox icon={transaction.icon} color={transaction.color} />

                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                      <p className="truncate text-base leading-6 font-medium text-gray-800">
                        {transaction.description}
                      </p>
                      <span className="text-sm leading-5 font-normal text-gray-600">
                        {transaction.date}
                      </span>
                    </div>
                  </div>

                  <div className="hidden h-20 w-40 shrink-0 items-center justify-center px-6 sm:flex">
                    <Tag color={transaction.color}>{transaction.category}</Tag>
                  </div>

                  <div className="flex h-20 w-40 shrink-0 items-center justify-end gap-2 px-6">
                    <span className="text-right text-sm leading-5 font-semibold whitespace-nowrap text-gray-800">
                      {isIncome ? '+ ' : '- '}
                      {formatCurrency(transaction.amount)}
                    </span>
                    {isIncome ? (
                      <CircleArrowUp className="size-4 shrink-0 text-green-base" />
                    ) : (
                      <CircleArrowDown className="size-4 shrink-0 text-red-base" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <footer className="flex items-center justify-center px-6 py-5">
            <TextLinkButton onClick={() => setIsNewTransactionOpen(true)}>
              <Plus className="size-5" />
              Nova transação
            </TextLinkButton>
          </footer>
        </section>

        {/* Section: Categorias */}
        <section className="flex flex-col self-start overflow-hidden rounded-[12px] border border-gray-200 bg-white">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <h2 className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
              Categorias
            </h2>
            <TextLink to="/categorias">
              Gerenciar
              <ChevronRight className="size-5" />
            </TextLink>
          </header>

          <div className="flex flex-col gap-5 p-6">
            {CATEGORIES_SUMMARY.map((category) => (
              <div key={category.id} className="flex items-center gap-1">
                <Tag color={category.color}>{category.title}</Tag>

                <span className="min-w-0 flex-1 text-right text-sm leading-5 font-normal text-gray-600">
                  {category.itemsCount} {category.itemsCount === 1 ? 'item' : 'itens'}
                </span>

                <span className="w-[88px] shrink-0 text-right text-sm leading-5 font-semibold text-gray-800">
                  {formatCurrency(category.totalAmount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <NewTransactionDialog
        open={isNewTransactionOpen}
        onOpenChange={setIsNewTransactionOpen}
        categories={CATEGORIES_SUMMARY.map((category) => ({
          value: category.id,
          label: category.title,
        }))}
        onSubmit={() => {
          toast.success('Transação registrada com sucesso')
        }}
      />
    </AppLayout>
  )
}
