import { SquarePen, Trash } from 'lucide-react'
import { CategoryIconBox } from '@/components'
import { IconButton, Pagination, Tag, TransactionTypeBadge } from '@/components/ui'
import { formatCurrency } from '@/lib/format'
import { ENTER_ANIMATION, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { TransactionRowItem } from '../types'

const headerCellClasses =
  'px-6 py-5 text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase'

const SKELETON_ROWS = ['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4']

export interface TransactionsTableProps {
  transactions: TransactionRowItem[]
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  /** Exibe linhas de carregamento no lugar da lista. */
  loading?: boolean
  /** Mensagem exibida quando não há transações. */
  emptyMessage?: string
  /** Posição do bloco na sequência de entrada da página. */
  enterIndex?: number
}

export function TransactionsTable({
  transactions,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'Nenhuma transação encontrada.',
  enterIndex = 0,
}: TransactionsTableProps) {
  return (
    <section
      className={cn(
        ENTER_ANIMATION,
        'flex flex-col overflow-hidden rounded-[12px] border border-gray-200 bg-white',
      )}
      style={stagger(enterIndex)}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-220 border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className={`${headerCellClasses} text-left`}>Descrição</th>
              <th className={`${headerCellClasses} w-28 text-center`}>Data</th>
              <th className={`${headerCellClasses} w-50 text-center`}>Categoria</th>
              <th className={`${headerCellClasses} w-34 text-center`}>Tipo</th>
              <th className={`${headerCellClasses} w-50 text-right`}>Valor</th>
              <th className={`${headerCellClasses} w-30 text-right`}>Ações</th>
            </tr>
          </thead>

          {/* A chave pela página reanima as linhas ao trocar de página. */}
          <tbody key={currentPage} aria-busy={loading || undefined}>
            {loading &&
              SKELETON_ROWS.map((row) => (
                <tr key={row} className="h-18 border-b border-gray-200" aria-hidden>
                  <td className="px-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 shrink-0 animate-pulse rounded-lg bg-gray-200" />
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </div>
                  </td>
                  <td colSpan={5} className="px-6">
                    <div className="ml-auto h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  </td>
                </tr>
              ))}

            {!loading && transactions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm leading-5 font-normal text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading && transactions.map((transaction, index) => {
              const isIncome = transaction.type === 'INCOME'

              return (
                <tr
                  key={transaction.id}
                  className={cn(
                    ENTER_ANIMATION,
                    'h-18 border-b border-gray-200 transition-colors duration-200 hover:bg-gray-100/70',
                  )}
                  style={stagger(enterIndex + 1 + index, { step: 40, max: 12 })}
                >
                  <td className="px-6">
                    <div className="flex items-center gap-4">
                      <CategoryIconBox icon={transaction.icon} color={transaction.color} />
                      <span className="truncate text-base leading-6 font-medium text-gray-800">
                        {transaction.description}
                      </span>
                    </div>
                  </td>

                  <td className="w-28 px-6 text-center text-sm leading-5 font-normal whitespace-nowrap text-gray-600">
                    {transaction.date}
                  </td>

                  <td className="w-50 px-6 text-center">
                    <Tag color={transaction.color}>{transaction.category}</Tag>
                  </td>

                  <td className="w-34 px-6 text-center">
                    <TransactionTypeBadge type={transaction.type} />
                  </td>

                  <td className="w-50 px-6 text-right text-sm leading-5 font-semibold whitespace-nowrap text-gray-800">
                    {isIncome ? '+ ' : '- '}
                    {formatCurrency(transaction.amount)}
                  </td>

                  <td className="w-30 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton
                        variant="danger"
                        aria-label={`Excluir ${transaction.description}`}
                        onClick={() => onDelete(transaction.id)}
                      >
                        <Trash />
                      </IconButton>

                      <IconButton
                        aria-label={`Editar ${transaction.description}`}
                        onClick={() => onEdit(transaction.id)}
                      >
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
