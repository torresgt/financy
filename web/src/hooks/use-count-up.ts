import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))

/**
 * Anima um número do valor anterior até `target`.
 * Na primeira renderização parte de 0. Respeita `prefers-reduced-motion`.
 */
export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))
  const fromRef = useRef(value)

  useEffect(() => {
    if (prefersReducedMotion()) {
      fromRef.current = target
      setValue(target)
      return
    }

    const from = fromRef.current
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const current = from + (target - from) * easeOutExpo(progress)
      fromRef.current = current
      setValue(current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
