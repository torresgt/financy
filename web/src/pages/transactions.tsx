import { Plus, Search, SquarePen, Trash } from 'lucide-react'
import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { CategoryIconBox, type CategoryIconName } from '@/components/category-icon'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select'
import { Tag, type CategoryColor } from '@/components/ui/tag'
import { TransactionTypeBadge } from '@/components/ui/transaction-type-badge'
import { formatCurrency } from '@/lib/format'
import type { TransactionType } from '@/types/api'

interface TransactionRowItem {
  id: string
  description: string
  date: string
  category: string
  color: CategoryColor
  icon: CategoryIconName
  type: TransactionType
  amount: number
}

const TRANSACTIONS_DATA: TransactionRowItem[] = [
  {
    id: '1',
    description: 'Jantar no Restaurante',
    date: '30/11/25',
    category: 'Alimentação',
    color: 'blue',
    icon: 'utensils',
    type: 'EXPENSE',
    amount: 89.5,
  },
  {
    id: '2',
    description: 'Posto de Gasolina',
    date: '29/11/25',
    category: 'Transporte',
    color: 'purple',
    icon: 'car-front',
    type: 'EXPENSE',
    amount: 100.0,
  },
  {
    id: '3',
    description: 'Compras no Mercado',
    date: '28/11/25',
    category: 'Mercado',
    color: 'orange',
    icon: 'shopping-cart',
    type: 'EXPENSE',
    amount: 156.8,
  },
  {
    id: '4',
    description: 'Retorno de Investimento',
    date: '26/11/25',
    category: 'Investimento',
    color: 'green',
    icon: 'piggy-bank',
    type: 'INCOME',
    amount: 340.25,
  },
  {
    id: '5',
    description: 'Aluguel',
    date: '26/11/25',
    category: 'Utilidades',
    color: 'yellow',
    icon: 'tool-case',
    type: 'EXPENSE',
    amount: 1700.0,
  },
  {
    id: '6',
    description: 'Freelance',
    date: '24/11/25',
    category: 'Salário',
    color: 'green',
    icon: 'briefcase-business',
    type: 'INCOME',
    amount: 2500.0,
  },
  {
    id: '7',
    description: 'Compras Jantar',
    date: '22/11/25',
    category: 'Mercado',
    color: 'orange',
    icon: 'shopping-cart',
    type: 'EXPENSE',
    amount: 150.0,
  },
  {
    id: '8',
    description: 'Cinema',
    date: '18/12/25',
    category: 'Entretenimento',
    color: 'pink',
    icon: 'ticket',
    type: 'EXPENSE',
    amount: 88.0,
  },
]

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'Todas' },
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'mercado', label: 'Mercado' },
  { value: 'investimento', label: 'Investimento' },
  { value: 'utilidades', label: 'Utilidades' },
  { value: 'salario', label: 'Salário' },
  { value: 'entretenimento', label: 'Entretenimento' },
]

const PERIOD_OPTIONS = [
  { value: '2025-11', label: 'Novembro / 2025' },
  { value: '2025-12', label: 'Dezembro / 2025' },
  { value: '2026-01', label: 'Janeiro / 2026' },
  { value: 'ALL', label: 'Todo o período' },
]

export function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [periodFilter, setPeriodFilter] = useState('2025-11')
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl leading-8 font-bold text-gray-800">Transações</h1>
            <p className="text-base leading-6 font-normal text-gray-600">
              Gerencie todas as suas transações financeiras
            </p>
          </div>

          <Button variant="solid" size="sm">
            <Plus />
            Nova transação
          </Button>
        </header>

        {/* Filters Section */}
        <section className="grid grid-cols-1 gap-4 rounded-[12px] border border-gray-200 bg-white px-6 pt-5 pb-6 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Buscar"
            placeholder="Buscar por descrição"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            leftIcon={<Search />}
          />

          <SelectField
            label="Tipo"
            value={typeFilter}
            onValueChange={setTypeFilter}
            options={TYPE_OPTIONS}
          />

          <SelectField
            label="Categoria"
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            options={CATEGORY_OPTIONS}
          />

          <SelectField
            label="Período"
            value={periodFilter}
            onValueChange={setPeriodFilter}
            options={PERIOD_OPTIONS}
          />
        </section>

        {/* Table Section */}
        <section className="flex flex-col overflow-hidden rounded-[12px] border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-5 text-left text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
                    Descrição
                  </th>
                  <th className="w-[112px] px-6 py-5 text-center text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="w-[200px] px-6 py-5 text-center text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
                    Categoria
                  </th>
                  <th className="w-[136px] px-6 py-5 text-center text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="w-[200px] px-6 py-5 text-right text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="w-[120px] px-6 py-5 text-right text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {TRANSACTIONS_DATA.map((transaction) => {
                  const isIncome = transaction.type === 'INCOME'

                  return (
                    <tr
                      key={transaction.id}
                      className="h-[72px] border-b border-gray-200"
                    >
                      <td className="px-6">
                        <div className="flex items-center gap-4">
                          <CategoryIconBox
                            icon={transaction.icon}
                            color={transaction.color}
                          />
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
                          <IconButton
                            variant="danger"
                            aria-label={`Excluir ${transaction.description}`}
                          >
                            <Trash />
                          </IconButton>

                          <IconButton
                            aria-label={`Editar ${transaction.description}`}
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
            totalPages={3}
            totalItems={27}
            pageSize={10}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>
    </AppLayout>
  )
}
