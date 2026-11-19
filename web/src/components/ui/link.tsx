import type { ComponentProps } from 'react'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router'
import { cn } from '@/lib/utils'

const linkClasses =
  'inline-flex cursor-pointer items-center gap-1 text-sm leading-5 font-medium text-brand-base underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:underline'

export type TextLinkProps = RouterLinkProps

export function TextLink({ className, ...props }: TextLinkProps) {
  return <RouterLink className={cn(linkClasses, className)} {...props} />
}

export type TextLinkButtonProps = ComponentProps<'button'>

export function TextLinkButton({ className, type = 'button', ...props }: TextLinkButtonProps) {
  return <button type={type} className={cn(linkClasses, className)} {...props} />
}
