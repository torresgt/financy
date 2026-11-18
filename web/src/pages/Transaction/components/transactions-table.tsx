import { SquarePen, Trash } from 'lucide-react'
import { CategoryIconBox } from '@/components/category-icon'
import { IconButton } from '@/components/ui/icon-button'
import { Pagination } from '@/components/ui/pagination'
import { Tag } from '@/components/ui/tag'
import { TransactionTypeBadge } from '@/components/ui/transaction-type-badge'
import { formatCurrency } from '@/lib/format'
import type { TransactionRowItem } from '../types'

const headerCellClasses =
  'px-6 py-5 text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase'

export interface TransactionsTableProps {
  transactions: TransactionRowItem[]
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function TransactionsTable({
  transactions,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TransactionsTableProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-[12px] border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className={`${headerCellClasses} text-left`}>Descrição</th>
              <th className={`${headerCellClasses} w-[112px] text-center`}>Data</th>
              <th className={`${headerCellClasses} w-[200px] text-center`}>Categoria</th>
              <th className={`${headerCellClasses} w-[136px] text-center`}>Tipo</th>
              <th className={`${headerCellClasses} w-[200px] text-right`}>Valor</th>
              <th className={`${headerCellClasses} w-[120px] text-right`}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => {
              const isIncome = transaction.type === 'INCOME'

              return (
                <tr key={transaction.id} className="h-[72px] border-b border-gray-200">
                  <td className="px-6">
                    <div className="flex items-center gap-4">
                      <CategoryIconBox icon={transaction.icon} color={transaction.color} />
                      <span className="truncate text-base leading-6 font-medium text-gray-800">
                        {transaction.description}
                      </span>
                    </div>
                  </td>

                  <td className="w-[112px] px-6 text-center text-sm leading-5 font-normal whitespace-nowrap text-gray-600">
                    {transaction.date}
                  </td>

                  <td className="w-[200px] px-6 text-center">
                    <Tag color={transaction.color}>{transaction.category}</Tag>
                  </td>

                  <td className="w-[136px] px-6 text-center">
                    <TransactionTypeBadge type={transaction.type} />
                  </td>

                  <td className="w-[200px] px-6 text-right text-sm leading-5 font-semibold whitespace-nowrap text-gray-800">
                    {isIncome ? '+ ' : '- '}
                    {formatCurrency(transaction.amount)}
                  </td>

                  <td className="w-[120px] px-6">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton variant="danger" aria-label={`Excluir ${transaction.description}`}>
                        <Trash />
                      </IconButton>

                      <IconButton aria-label={`Editar ${transaction.description}`}>
                        <SquarePen />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </section>
  )
}
