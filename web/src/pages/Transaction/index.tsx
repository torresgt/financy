import { useMutation, useQuery } from '@apollo/client/react'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AppLayout, PageHeader } from '@/components'
import { Button, ConfirmDialog } from '@/components/ui'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { getErrorMessage } from '@/lib/graphql-errors'
import { GET_CATEGORIES } from '@/pages/Categories/queries'
import type {
  Category,
  CreateTransactionInput,
  Transaction,
  TransactionFilterInput,
  UpdateTransactionInput,
} from '@/types/api'
import { TransactionDialog, TransactionsFilters, TransactionsTable } from './components'
import { ALL_CATEGORIES_OPTION, PAGE_SIZE } from './constants'
import {
  CREATE_TRANSACTION,
  DELETE_TRANSACTION,
  GET_TRANSACTIONS,
  UPDATE_TRANSACTION,
} from './queries'
import type { TransactionFilters } from './types'
import { getInitialFilters, getPeriodOptions, toApiFilter, toRowItem } from './utils'

const REFETCH_ACTIVE = { refetchQueries: 'active' as const }

export function TransactionsPage() {
  const [filters, setFilters] = useState(getInitialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [dialog, setDialog] = useState<{ open: boolean; transaction: Transaction | null }>({
    open: false,
    transaction: null,
  })
  const [toDelete, setToDelete] = useState<Transaction | null>(null)

  const debouncedSearch = useDebouncedValue(filters.search)
  const apiFilter = useMemo(
    () => toApiFilter({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  )

  const transactionsQuery = useQuery<
    { transactions: Transaction[] },
    { filter: TransactionFilterInput }
  >(GET_TRANSACTIONS, { variables: { filter: apiFilter } })

  const categoriesQuery = useQuery<{ categories: Category[] }>(GET_CATEGORIES)

  const [createTransaction] = useMutation<
    { createTransaction: Transaction },
    { data: CreateTransactionInput }
  >(CREATE_TRANSACTION, REFETCH_ACTIVE)

  const [updateTransaction] = useMutation<
    { updateTransaction: Transaction },
    { id: string; data: UpdateTransactionInput }
  >(UPDATE_TRANSACTION, REFETCH_ACTIVE)

  const [deleteTransaction] = useMutation<{ deleteTransaction: boolean }, { id: string }>(
    DELETE_TRANSACTION,
    REFETCH_ACTIVE,
  )

  const transactions =
    (transactionsQuery.data ?? transactionsQuery.previousData)?.transactions ?? []
  const categories = categoriesQuery.data?.categories ?? []

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const pageItems = useMemo(
    () => transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(toRowItem),
    [transactions, page],
  )

  const periodOptions = useMemo(() => getPeriodOptions(), [])
  const categoryOptions = useMemo(
    () => categories.map(({ id, title }) => ({ value: id, label: title })),
    [categories],
  )

  function handleFiltersChange(next: TransactionFilters) {
    setFilters(next)
    setCurrentPage(1)
  }

  function findTransaction(id: string) {
    return transactions.find((transaction) => transaction.id === id) ?? null
  }

  async function handleSubmit(input: CreateTransactionInput) {
    const editing = dialog.transaction
    try {
      if (editing) {
        await updateTransaction({ variables: { id: editing.id, data: input } })
        toast.success('Transação atualizada com sucesso')
      } else {
        await createTransaction({ variables: { data: input } })
        toast.success('Transação registrada com sucesso')
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
      throw error
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteTransaction({ variables: { id: toDelete.id } })
      toast.success('Transação excluída com sucesso')
    } catch (error) {
      toast.error(getErrorMessage(error))
      throw error
    }
  }

  const isInitialLoading = transactionsQuery.loading && transactions.length === 0
  const hasActiveFilters = Object.keys(apiFilter).some((key) => key !== 'startDate' && key !== 'endDate')

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Transações"
          description="Gerencie todas as suas transações financeiras"
          action={
            <Button
              variant="solid"
              size="sm"
              onClick={() => setDialog({ open: true, transaction: null })}
            >
              <Plus />
              Nova transação
            </Button>
          }
        />

        <TransactionsFilters
          enterIndex={1}
          value={filters}
          onChange={handleFiltersChange}
          categoryOptions={[ALL_CATEGORIES_OPTION, ...categoryOptions]}
          periodOptions={periodOptions}
        />

        <TransactionsTable
          enterIndex={2}
          loading={isInitialLoading}
          emptyMessage={
            transactionsQuery.error
              ? `Não foi possível carregar as transações. ${getErrorMessage(transactionsQuery.error)}`
              : hasActiveFilters
                ? 'Nenhuma transação encontrada para os filtros selecionados.'
                : 'Nenhuma transação registrada neste período.'
          }
          transactions={pageItems}
          currentPage={page}
          totalPages={totalPages}
          totalItems={transactions.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          onEdit={(id) => setDialog({ open: true, transaction: findTransaction(id) })}
          onDelete={(id) => setToDelete(findTransaction(id))}
        />
      </div>

      <TransactionDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        transaction={dialog.transaction}
        categories={categoryOptions}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir transação"
        description={
          toDelete
            ? `Tem certeza que deseja excluir "${toDelete.description}"? Esta ação não pode ser desfeita.`
            : undefined
        }
        onConfirm={handleDelete}
      />
    </AppLayout>
  )
}
