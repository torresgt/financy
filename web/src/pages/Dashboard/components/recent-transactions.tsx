import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus } from 'lucide-react'
import { CategoryIconBox } from '@/components/category-icon'
import { TextLink, TextLinkButton } from '@/components/ui/link'
import { Tag } from '@/components/ui/tag'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { RecentTransactionItem } from '../types'

export interface RecentTransactionsProps {
  transactions: RecentTransactionItem[]
  onNewTransaction: () => void
  className?: string
}

export function RecentTransactions({
  transactions,
  onNewTransaction,
  className,
}: RecentTransactionsProps) {
  return (
    <section
      className={cn(
        'flex flex-col self-start overflow-hidden rounded-[12px] border border-gray-200 bg-white',
        className,
      )}
    >
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
        {transactions.map((transaction) => {
          const isIncome = transaction.type === 'INCOME'

          return (
            <div key={transaction.id} className="flex items-center border-b border-gray-200">
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
        <TextLinkButton onClick={onNewTransaction}>
          <Plus className="size-5" />
          Nova transação
        </TextLinkButton>
      </footer>
    </section>
  )
}
