import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const avatarVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full bg-gray-300 font-medium text-gray-800 select-none',
  {
    variants: {
      size: {
        sm: 'size-9 text-sm leading-5',
        lg: 'size-16 text-2xl leading-8',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

export interface AvatarProps extends ComponentProps<'div'>, VariantProps<typeof avatarVariants> {
  name: string
}

export function Avatar({ name, size, className, ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      role="img"
      aria-label={name}
      className={cn(avatarVariants({ size, className }))}
      {...props}
    >
      {getInitials(name)}
    </div>
  )
}

export { avatarVariants }
