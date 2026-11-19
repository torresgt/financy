import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/types/api'

const OPTIONS = [
  {
    value: 'EXPENSE',
    label: 'Despesa',
    Icon: CircleArrowDown,
    activeIconClasses: '[&[data-state=on]_svg]:text-danger',
  },
  {
    value: 'INCOME',
    label: 'Receita',
    Icon: CircleArrowUp,
    activeIconClasses: '[&[data-state=on]_svg]:text-success',
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
      onValueChange={(next) => next && onValueChange?.(next as TransactionType)}
      aria-label="Tipo da transação"
      className={cn(
        'relative grid grid-cols-2 gap-2 rounded-[12px] border border-gray-200 p-2',
        className,
      )}
    >
      {value && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-2 bottom-2 left-2 w-[calc(50%-12px)] rounded-lg border bg-gray-100',
            'transition-[translate,border-color] duration-300 ease-out-expo',
            value === 'INCOME' ? 'translate-x-[calc(100%+8px)] border-success' : 'border-danger',
          )}
        />
      )}

      {OPTIONS.map(({ value: optionValue, label, Icon, activeIconClasses }) => (
        <ToggleGroupPrimitive.Item
          key={optionValue}
          value={optionValue}
          className={cn(
            'relative flex h-11 cursor-pointer items-center justify-center gap-3 rounded-lg text-base leading-6 font-normal text-gray-600 transition-[color,background-color,scale] duration-200 ease-out outline-none',
            'hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-brand-base/30 active:scale-[0.98]',
            'data-[state=on]:font-medium data-[state=on]:text-gray-800',
            '[&_svg]:size-4 [&_svg]:text-gray-400 [&_svg]:transition-[color,scale] [&_svg]:duration-300 [&_svg]:ease-spring [&[data-state=on]_svg]:scale-110',
            activeIconClasses,
          )}
        >
          <Icon />
          {label}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  )
}
