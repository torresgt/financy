import type { CSSProperties } from 'react'

/** Classe de entrada padrão para blocos e cards (ver `--animate-fade-up` em index.css). */
export const ENTER_ANIMATION = 'animate-fade-up'

interface StaggerOptions {
  /** Intervalo entre itens, em ms. */
  step?: number
  /** Limite de itens com atraso crescente, para listas longas não demorarem a aparecer. */
  max?: number
}

/** Atraso escalonado para animar itens em sequência. */
export function stagger(index: number, { step = 60, max = 10 }: StaggerOptions = {}): CSSProperties {
  return { animationDelay: `${Math.min(index, max) * step}ms` }
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}
