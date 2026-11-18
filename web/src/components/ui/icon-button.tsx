import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white p-2 transition-[color,background-color,border-color,scale] duration-200 ease-out outline-none hover:bg-gray-200 active:scale-90 focus-visible:ring-2 focus-visible:ring-brand-base/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'text-gray-700',
        danger: 'text-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface IconButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof iconButtonVariants> {}

export function IconButton({
  className,
  variant,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      data-slot="icon-button"
      type={type}
      className={cn(iconButtonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { iconButtonVariants }
