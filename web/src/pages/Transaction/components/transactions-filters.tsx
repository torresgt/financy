import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SelectField } from '@/components/ui/select'
import { CATEGORY_OPTIONS, PERIOD_OPTIONS, TYPE_OPTIONS } from '../constants'
import type { TransactionFilters } from '../types'

export interface TransactionsFiltersProps {
  value: TransactionFilters
  onChange: (filters: TransactionFilters) => void
}

export function TransactionsFilters({ value, onChange }: TransactionsFiltersProps) {
  function update<K extends keyof TransactionFilters>(key: K, fieldValue: TransactionFilters[K]) {
    onChange({ ...value, [key]: fieldValue })
  }

  return (
    <section className="grid grid-cols-1 gap-4 rounded-[12px] border border-gray-200 bg-white px-6 pt-5 pb-6 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Buscar"
        placeholder="Buscar por descrição"
        value={value.search}
        onChange={(event) => update('search', event.target.value)}
        leftIcon={<Search />}
      />

      <SelectField
        label="Tipo"
        value={value.type}
        onValueChange={(type) => update('type', type)}
        options={TYPE_OPTIONS}
      />

      <SelectField
        label="Categoria"
        value={value.category}
        onValueChange={(category) => update('category', category)}
        options={CATEGORY_OPTIONS}
      />

      <SelectField
        label="Período"
        value={value.period}
        onValueChange={(period) => update('period', period)}
        options={PERIOD_OPTIONS}
      />
    </section>
  )
}
