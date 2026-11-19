import { useCountUp } from '@/hooks/use-count-up'

export interface AnimatedNumberProps {
  value: number
  /** Formata o valor exibido (ex.: `formatCurrency`). Padrão: inteiro em pt-BR. */
  format?: (value: number) => string
  duration?: number
}

const defaultFormat = (value: number) => Math.round(value).toLocaleString('pt-BR')

export function AnimatedNumber({ value, format = defaultFormat, duration }: AnimatedNumberProps) {
  const current = useCountUp(value, duration)

  return (
    <span className="tabular-nums">
      {/* Leitores de tela recebem o valor final, sem os passos intermediários. */}
      <span aria-hidden>{format(current)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
