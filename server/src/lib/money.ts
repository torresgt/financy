/** Converte um valor em reais (ex.: 12.34) para centavos (1234). */
export function toCents(value: number): number {
  return Math.round(value * 100)
}

/** Converte um valor em centavos (1234) para reais (12.34). */
export function fromCents(cents: number): number {
  return cents / 100
}
