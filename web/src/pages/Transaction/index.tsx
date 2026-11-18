import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AppLayout } from '@/components/app-layout'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { NewTransactionDialog } from './components/new-transaction-dialog'
import { TransactionsFilters } from './components/transactions-filters'
import { TransactionsTable } from './components/transactions-table'
import {
  CATEGORY_FORM_OPTIONS,
  INITIAL_FILTERS,
  PAGINATION_MOCK,
  TRANSACTIONS_DATA,
} from './constants'

export function TransactionsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Transações"
          description="Gerencie todas as suas transações financeiras"
          action={
            <Button variant="solid" size="sm" onClick={() => setIsNewTransactionOpen(true)}>
              <Plus />
              Nova transação
            </Button>
          }
        />

        <TransactionsFilters value={filters} onChange={setFilters} />

        <TransactionsTable
          transactions={TRANSACTIONS_DATA}
          currentPage={currentPage}
          totalPages={PAGINATION_MOCK.totalPages}
          totalItems={PAGINATION_MOCK.totalItems}
          pageSize={PAGINATION_MOCK.pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <NewTransactionDialog
        open={isNewTransactionOpen}
        onOpenChange={setIsNewTransactionOpen}
        categories={CATEGORY_FORM_OPTIONS}
        onSubmit={() => {
          toast.success('Transação registrada com sucesso')
        }}
      />
    </AppLayout>
  )
}
