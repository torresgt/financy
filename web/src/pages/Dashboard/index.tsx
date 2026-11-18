import { CircleArrowDown, CircleArrowUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AppLayout } from '@/components'
import { stagger } from '@/lib/motion'
import { NewTransactionDialog } from '@/pages/Transaction/components'
import { CategoriesOverview, RecentTransactions, SummaryCard } from './components'
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
          style={stagger(0)}
        />
        <SummaryCard
          icon={<CircleArrowUp className="text-brand-base" />}
          label="Receitas do mês"
          value={SUMMARY_MOCK.monthIncome}
          style={stagger(1)}
        />
        <SummaryCard
          icon={<CircleArrowDown className="text-red-base" />}
          label="Despesas do mês"
          value={SUMMARY_MOCK.monthExpense}
          style={stagger(2)}
        />

        <RecentTransactions
          className="lg:col-span-2"
          enterIndex={3}
          transactions={RECENT_TRANSACTIONS}
          onNewTransaction={() => setIsNewTransactionOpen(true)}
        />

        <CategoriesOverview enterIndex={4} categories={CATEGORIES_SUMMARY} />
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
