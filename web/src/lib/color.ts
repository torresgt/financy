export interface Hsv {
  /** 0–360 */
  h: number
  /** 0–1 */
  s: number
  /** 0–1 */
  v: number
}

const HEX_PATTERN = /^#([0-9a-f]{6})$/i

/** Indica se a cor é um hexadecimal personalizado (#rrggbb) em vez de uma cor da paleta. */
export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_PATTERN.test(value)
}

/** Normaliza entradas como "abc", "#abc" ou "#AABBCC" para "#aabbcc". Retorna null se inválido. */
export function normalizeHex(input: string) {
  let hex = input.trim().replace(/^#/, '').toLowerCase()
  if (/^[0-9a-f]{3}$/.test(hex)) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }
  return /^[0-9a-f]{6}$/.test(hex) ? `#${hex}` : null
}

export function hsvToHex({ h, s, v }: Hsv) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    const channel = v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
    return Math.round(channel * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(5)}${f(3)}${f(1)}`
}

export function hexToHsv(hex: string): Hsv {
  const normalized = normalizeHex(hex) ?? '#000000'
  const r = Number.parseInt(normalized.slice(1, 3), 16) / 255
  const g = Number.parseInt(normalized.slice(3, 5), 16) / 255
  const b = Number.parseInt(normalized.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const delta = max - Math.min(r, g, b)

  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
  }

  return {
    h: (h * 60 + 360) % 360,
    s: max === 0 ? 0 : delta / max,
    v: max,
  }
}

/** Estilos de fundo claro + texto para cores personalizadas (equivalente aos tokens *-light / *-dark). */
export function customColorStyles(hex: string) {
  return {
    background: `color-mix(in srgb, ${hex} 15%, white)`,
    base: hex,
    dark: `color-mix(in srgb, ${hex} 80%, black)`,
  }
}
