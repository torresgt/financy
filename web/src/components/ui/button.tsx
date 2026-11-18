import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,scale] duration-200 ease-out outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-base/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        solid: 'bg-brand-base text-white hover:bg-brand-dark',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-200',
        ghost: 'text-gray-700 hover:bg-gray-200',
      },
      size: {
        md: 'h-12 px-4 py-3 text-base leading-6 [&_svg:not([class*="size-"])]:size-[18px]',
        sm: 'h-9 px-3 py-2 text-sm leading-5 [&_svg:not([class*="size-"])]:size-4',
        icon: 'size-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-200 [&_svg:not([class*="size-"])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { buttonVariants }
