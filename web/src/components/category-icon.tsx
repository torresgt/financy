import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Tag as TagIcon,
  Ticket,
  ToolCase,
  Utensils,
  type LucideIcon,
} from 'lucide-react'
import type { ComponentProps } from 'react'
import type { CategoryColor } from '@/components/ui/tag'
import { cn } from '@/lib/utils'

export type CategoryIconName =
  | 'briefcase-business'
  | 'car-front'
  | 'heart-pulse'
  | 'piggy-bank'
  | 'shopping-cart'
  | 'ticket'
  | 'tool-case'
  | 'utensils'
  | 'paw-print'
  | 'house'
  | 'gift'
  | 'dumbbell'
  | 'book-open'
  | 'baggage-claim'
  | 'mailbox'
  | 'receipt-text'
  | 'tag'

export const CATEGORY_ICONS: Record<CategoryIconName, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  mailbox: Mailbox,
  'receipt-text': ReceiptText,
  tag: TagIcon,
}

const colorStyles: Record<CategoryColor, string> = {
  gray: 'bg-gray-200 text-gray-700',
  blue: 'bg-blue-light text-blue-base',
  purple: 'bg-purple-light text-purple-base',
  pink: 'bg-pink-light text-pink-base',
  red: 'bg-red-light text-red-base',
  orange: 'bg-orange-light text-orange-base',
  yellow: 'bg-yellow-light text-yellow-base',
  green: 'bg-green-light text-green-base',
}

export interface CategoryIconBoxProps extends Omit<ComponentProps<'div'>, 'color'> {
  icon?: CategoryIconName | (string & {})
  color?: CategoryColor
}

export function CategoryIconBox({
  icon = 'tag',
  color = 'blue',
  className,
  ...props
}: CategoryIconBoxProps) {
  const IconComponent = CATEGORY_ICONS[icon as CategoryIconName] ?? TagIcon

  return (
    <div
      data-slot="category-icon"
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4',
        colorStyles[color] ?? colorStyles.blue,
        className,
      )}
      {...props}
    >
      <IconComponent />
    </div>
  )
}
