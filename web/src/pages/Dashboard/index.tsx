import { useMutation, useQuery } from '@apollo/client/react'
import { CircleArrowDown, CircleArrowUp, RotateCw, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AppLayout } from '@/components'
import { Button } from '@/components/ui'
import { getErrorMessage } from '@/lib/graphql-errors'
import { stagger } from '@/lib/motion'
import { TransactionDialog } from '@/pages/Transaction/components'
import { CREATE_TRANSACTION } from '@/pages/Transaction/queries'
import type { CreateTransactionInput, Transaction, TransactionFilterInput } from '@/types/api'
import { CategoriesOverview, RecentTransactions, SummaryCard } from './components'
import { GET_DASHBOARD } from './queries'
import type { DashboardQueryData } from './types'
import { getMonthFilter, toCategoriesOverview, toRecentTransactions } from './utils'

export function DashboardPage() {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)
  const monthFilter = useMemo(() => getMonthFilter(), [])

  const { data, loading, error, refetch } = useQuery<
    DashboardQueryData,
    { monthFilter: TransactionFilterInput }
  >(GET_DASHBOARD, { variables: { monthFilter } })

  const [createTransaction] = useMutation<
    { createTransaction: Transaction },
    { data: CreateTransactionInput }
  >(CREATE_TRANSACTION, {
    // Saldo, totais do mês, recentes e categorias mudam com a nova transação.
    refetchQueries: [GET_DASHBOARD],
  })

  const isInitialLoading = loading && !data
  const recentTransactions = useMemo(() => toRecentTransactions(data?.transactions ?? []), [data])
  const categoriesOverview = useMemo(() => toCategoriesOverview(data?.categories ?? []), [data])
  const categoryOptions = useMemo(
    () => (data?.categories ?? []).map(({ id, title }) => ({ value: id, label: title })),
    [data],
  )

  async function handleCreateTransaction(input: CreateTransactionInput) {
    try {
      await createTransaction({ variables: { data: input } })
      toast.success('Transação registrada com sucesso')
    } catch (createError) {
      toast.error(getErrorMessage(createError))
      throw createError
    }
  }

  if (error && !data) {
    return (
      <AppLayout>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-[12px] border border-gray-200 bg-white p-8 text-center">
          <p className="text-base leading-6 font-medium text-gray-800">
            Não foi possível carregar o dashboard.
          </p>
          <p className="text-sm leading-5 text-gray-600">{getErrorMessage(error)}</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            <RotateCw />
            Tentar novamente
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SummaryCard
          icon={<Wallet className="text-purple-base" />}
          label="Saldo total"
          value={data?.balance.balance ?? 0}
          style={stagger(0)}
        />
        <SummaryCard
          icon={<CircleArrowUp className="text-brand-base" />}
          label="Receitas do mês"
          value={data?.month.totalIncome ?? 0}
          style={stagger(1)}
        />
        <SummaryCard
          icon={<CircleArrowDown className="text-red-base" />}
          label="Despesas do mês"
          value={data?.month.totalExpense ?? 0}
          style={stagger(2)}
        />

        <RecentTransactions
          className="lg:col-span-2"
          enterIndex={3}
          loading={isInitialLoading}
          transactions={recentTransactions}
          onNewTransaction={() => setIsNewTransactionOpen(true)}
        />

        <CategoriesOverview
          enterIndex={4}
          loading={isInitialLoading}
          categories={categoriesOverview}
        />
      </div>

      <TransactionDialog
        open={isNewTransactionOpen}
        onOpenChange={setIsNewTransactionOpen}
        categories={categoryOptions}
        onSubmit={handleCreateTransaction}
      />
    </AppLayout>
  )
}
