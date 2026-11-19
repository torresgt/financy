import { useCountUp } from '@/hooks/use-count-up'

export interface AnimatedNumberProps {
  value: number
  format?: (value: number) => string
  duration?: number
}

const defaultFormat = (value: number) => Math.round(value).toLocaleString('pt-BR')

export function AnimatedNumber({ value, format = defaultFormat, duration }: AnimatedNumberProps) {
  const current = useCountUp(value, duration)

  return (
    <span className="tabular-nums">
      <span aria-hidden>{format(current)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
