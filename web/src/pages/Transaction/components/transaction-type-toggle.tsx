import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/types/api'

const OPTIONS = [
  {
    value: 'EXPENSE',
    label: 'Despesa',
    Icon: CircleArrowDown,
    activeClasses: 'data-[state=on]:border-danger [&[data-state=on]_svg]:text-danger',
  },
  {
    value: 'INCOME',
    label: 'Receita',
    Icon: CircleArrowUp,
    activeClasses: 'data-[state=on]:border-success [&[data-state=on]_svg]:text-success',
  },
] as const

export interface TransactionTypeToggleProps {
  value?: TransactionType
  onValueChange?: (value: TransactionType) => void
  className?: string
}

export function TransactionTypeToggle({ value, onValueChange, className }: TransactionTypeToggleProps) {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={value}
      // Impede desmarcar: sempre deve haver um tipo selecionado.
      onValueChange={(next) => next && onValueChange?.(next as TransactionType)}
      aria-label="Tipo da transação"
      className={cn('grid grid-cols-2 gap-2 rounded-[12px] border border-gray-200 p-2', className)}
    >
      {OPTIONS.map(({ value: optionValue, label, Icon, activeClasses }) => (
        <ToggleGroupPrimitive.Item
          key={optionValue}
          value={optionValue}
          className={cn(
            'flex h-11 cursor-pointer items-center justify-center gap-3 rounded-lg border border-transparent text-base leading-6 font-normal text-gray-600 transition-colors outline-none',
            'hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-brand-base/30',
            'data-[state=on]:bg-gray-100 data-[state=on]:font-medium data-[state=on]:text-gray-800',
            '[&_svg]:size-4 [&_svg]:text-gray-400',
            activeClasses,
          )}
        >
          <Icon />
          {label}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  )
}
