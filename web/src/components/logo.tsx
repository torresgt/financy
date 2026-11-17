import type { ComponentProps } from 'react'
import logoSvg from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

export type LogoProps = Omit<ComponentProps<'img'>, 'src'>

export function Logo({ className, alt = 'Financy', ...props }: LogoProps) {
  return (
    <img
      src={logoSvg}
      alt={alt}
      width={134}
      height={32}
      className={cn('h-8 w-[134px] shrink-0 select-none', className)}
      {...props}
    />
  )
}
