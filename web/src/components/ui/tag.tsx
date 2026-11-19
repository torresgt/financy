import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { customColorStyles, isHexColor } from '@/lib/color'
import { cn } from '@/lib/utils'

export type CategoryColor =
  | 'gray'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'

const tagVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1 text-sm leading-5 font-medium whitespace-nowrap',
  {
    variants: {
      color: {
        gray: 'bg-gray-200 text-gray-700',
        blue: 'bg-blue-light text-blue-dark',
        purple: 'bg-purple-light text-purple-dark',
        pink: 'bg-pink-light text-pink-dark',
        red: 'bg-red-light text-red-dark',
        orange: 'bg-orange-light text-orange-dark',
        yellow: 'bg-yellow-light text-yellow-dark',
        green: 'bg-green-light text-green-dark',
      },
    },
    defaultVariants: {
      color: 'blue',
    },
  },
)

export interface TagProps
  extends Omit<ComponentProps<'span'>, 'color'>,
    Omit<VariantProps<typeof tagVariants>, 'color'> {
  color?: CategoryColor | (string & {}) | null
}

export function Tag({ className, color, style, ...props }: TagProps) {
  if (isHexColor(color)) {
    const custom = customColorStyles(color)
    return (
      <span
        data-slot="tag"
        className={cn(tagVariants({ color: null }), className)}
        style={{ backgroundColor: custom.background, color: custom.dark, ...style }}
        {...props}
      />
    )
  }

  return (
    <span
      data-slot="tag"
      className={cn(tagVariants({ color: color as CategoryColor | null | undefined, className }))}
      style={style}
      {...props}
    />
  )
}

export { tagVariants }
