import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { CATEGORY_ICONS, type CategoryIconName } from '@/components/category-icon'
import { cn } from '@/lib/utils'

/** Ícones disponíveis para seleção (o ícone genérico "tag" fica de fora, como no design). */
const SELECTABLE_ICONS = (Object.keys(CATEGORY_ICONS) as CategoryIconName[]).filter(
  (name) => name !== 'tag',
)

const ICON_LABELS: Partial<Record<CategoryIconName, string>> = {
  'briefcase-business': 'Maleta',
  'car-front': 'Carro',
  'heart-pulse': 'Saúde',
  'piggy-bank': 'Cofrinho',
  'shopping-cart': 'Carrinho de compras',
  ticket: 'Ingresso',
  'tool-case': 'Caixa de ferramentas',
  utensils: 'Talheres',
  'paw-print': 'Pet',
  house: 'Casa',
  gift: 'Presente',
  dumbbell: 'Academia',
  'book-open': 'Livro',
  'baggage-claim': 'Bagagem',
  mailbox: 'Correspondência',
  'receipt-text': 'Recibo',
}

export interface CategoryIconPickerProps {
  id?: string
  value?: string
  onValueChange?: (icon: CategoryIconName) => void
  className?: string
  'aria-labelledby'?: string
}

export function CategoryIconPicker({
  value,
  onValueChange,
  className,
  ...props
}: CategoryIconPickerProps) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={(icon) => onValueChange?.(icon as CategoryIconName)}
      className={cn('grid grid-cols-8 gap-2', className)}
      {...props}
    >
      {SELECTABLE_ICONS.map((name) => {
        const Icon = CATEGORY_ICONS[name]

        return (
          <RadioGroupPrimitive.Item
            key={name}
            value={name}
            aria-label={ICON_LABELS[name] ?? name}
            className={cn(
              'flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-colors outline-none',
              'hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-brand-base/30',
              'data-[state=checked]:border-brand-base data-[state=checked]:bg-gray-100 data-[state=checked]:text-gray-800',
            )}
          >
            <Icon className="size-5" />
          </RadioGroupPrimitive.Item>
        )
      })}
    </RadioGroupPrimitive.Root>
  )
}
