import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AppLayout, PageHeader } from '@/components'
import { Button } from '@/components/ui'
import { NewTransactionDialog, TransactionsFilters, TransactionsTable } from './components'
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

        <TransactionsFilters enterIndex={1} value={filters} onChange={setFilters} />

        <TransactionsTable
          enterIndex={2}
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
