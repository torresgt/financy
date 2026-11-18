import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { CATEGORY_ICONS, type CategoryIconName } from '@/components/category-icon'
import { cn } from '@/lib/utils'
import { CATEGORY_ICON_LABELS, SELECTABLE_CATEGORY_ICONS } from '../constants'

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
      {SELECTABLE_CATEGORY_ICONS.map((name) => {
        const Icon = CATEGORY_ICONS[name]

        return (
          <RadioGroupPrimitive.Item
            key={name}
            value={name}
            aria-label={CATEGORY_ICON_LABELS[name] ?? name}
            className={cn(
              'flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-[color,background-color,border-color,scale] duration-200 ease-out outline-none',
              'hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-brand-base/30 active:scale-90',
              '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-(--ease-spring) data-[state=checked]:[&_svg]:scale-110',
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
