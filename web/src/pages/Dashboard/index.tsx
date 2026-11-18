import { CircleArrowDown, CircleArrowUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AppLayout } from '@/components/app-layout'
import { NewTransactionDialog } from '@/pages/Transaction/components/new-transaction-dialog'
import { CategoriesOverview } from './components/categories-overview'
import { RecentTransactions } from './components/recent-transactions'
import { SummaryCard } from './components/summary-card'
import {
  CATEGORIES_SUMMARY,
  CATEGORY_OPTIONS,
  RECENT_TRANSACTIONS,
  SUMMARY_MOCK,
} from './constants'

export function DashboardPage() {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SummaryCard
          icon={<Wallet className="text-purple-base" />}
          label="Saldo total"
          value={SUMMARY_MOCK.balance}
        />
        <SummaryCard
          icon={<CircleArrowUp className="text-brand-base" />}
          label="Receitas do mês"
          value={SUMMARY_MOCK.monthIncome}
        />
        <SummaryCard
          icon={<CircleArrowDown className="text-red-base" />}
          label="Despesas do mês"
          value={SUMMARY_MOCK.monthExpense}
        />

        <RecentTransactions
          className="lg:col-span-2"
          transactions={RECENT_TRANSACTIONS}
          onNewTransaction={() => setIsNewTransactionOpen(true)}
        />

        <CategoriesOverview categories={CATEGORIES_SUMMARY} />
      </div>

      <NewTransactionDialog
        open={isNewTransactionOpen}
        onOpenChange={setIsNewTransactionOpen}
        categories={CATEGORY_OPTIONS}
        onSubmit={() => {
          toast.success('Transação registrada com sucesso')
        }}
      />
    </AppLayout>
  )
}
