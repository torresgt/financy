import { Pipette } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { type Hsv, hexToHsv, hsvToHex, normalizeHex } from '@/lib/color'
import { cn } from '@/lib/utils'

interface EyeDropperResult {
  sRGBHex: string
}
interface EyeDropperApi {
  open: () => Promise<EyeDropperResult>
}
declare global {
  interface Window {
    EyeDropper?: new () => EyeDropperApi
  }
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/** Converte a posição do ponteiro em coordenadas relativas (0–1) ao elemento. */
function usePointerDrag(onMove: (x: number, y: number) => void) {
  const ref = useRef<HTMLDivElement>(null)

  function update(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    onMove(
      clamp((event.clientX - rect.left) / rect.width),
      clamp((event.clientY - rect.top) / rect.height),
    )
  }

  return {
    ref,
    onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
      event.currentTarget.setPointerCapture(event.pointerId)
      update(event)
    },
    onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event)
    },
  }
}

export interface ColorPickerPanelProps {
  /** Cor inicial em hexadecimal (#rrggbb). */
  initialColor?: string
  onApply: (hex: string) => void
  onCancel?: () => void
  className?: string
}

export function ColorPickerPanel({
  initialColor = '#1f6f43',
  onApply,
  onCancel,
  className,
}: ColorPickerPanelProps) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(initialColor))
  const hex = hsvToHex(hsv)
  const [hexDraft, setHexDraft] = useState(hex)

  // Mantém o campo de texto sincronizado quando a cor muda pelos controles visuais.
  useEffect(() => {
    setHexDraft(hex)
  }, [hex])

  const svArea = usePointerDrag((x, y) => setHsv((prev) => ({ ...prev, s: x, v: 1 - y })))
  const hueSlider = usePointerDrag((x) => setHsv((prev) => ({ ...prev, h: x * 360 })))

  const supportsEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window

  function commitHexDraft() {
    const normalized = normalizeHex(hexDraft)
    if (normalized) setHsv(hexToHsv(normalized))
    else setHexDraft(hex)
  }

  function handleSvKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 0.1 : 0.01
    const moves: Record<string, Partial<Hsv>> = {
      ArrowLeft: { s: clamp(hsv.s - step) },
      ArrowRight: { s: clamp(hsv.s + step) },
      ArrowUp: { v: clamp(hsv.v + step) },
      ArrowDown: { v: clamp(hsv.v - step) },
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    setHsv((prev) => ({ ...prev, ...move }))
  }

  function handleHueKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 1
    const delta =
      event.key === 'ArrowLeft' || event.key === 'ArrowDown'
        ? -step
        : event.key === 'ArrowRight' || event.key === 'ArrowUp'
          ? step
          : 0
    if (!delta) return
    event.preventDefault()
    setHsv((prev) => ({ ...prev, h: clamp(prev.h + delta, 0, 360) }))
  }

  async function handleEyeDropper() {
    if (!window.EyeDropper) return
    try {
      const result = await new window.EyeDropper().open()
      const normalized = normalizeHex(result.sRGBHex)
      if (normalized) setHsv(hexToHsv(normalized))
    } catch {
      // Usuário cancelou a captura (Esc) — nada a fazer.
    }
  }

  return (
    <div data-slot="color-picker-panel" className={cn('flex w-60 flex-col gap-3', className)}>
      {/* Saturação × brilho */}
      <div
        {...svArea}
        role="slider"
        tabIndex={0}
        aria-label="Saturação e brilho"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsv.s * 100)}
        aria-valuetext={`Saturação ${Math.round(hsv.s * 100)}%, brilho ${Math.round(hsv.v * 100)}%`}
        onKeyDown={handleSvKeyDown}
        className="relative h-36 w-full cursor-crosshair touch-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-base/30"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.h} 100% 50%)`,
        }}
      >
        <span
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }}
        />
      </div>

      <div className="flex items-center gap-3">
        {supportsEyeDropper && (
          <IconButton aria-label="Capturar cor da tela" onClick={handleEyeDropper}>
            <Pipette />
          </IconButton>
        )}

        {/* Matiz */}
        <div
          {...hueSlider}
          role="slider"
          tabIndex={0}
          aria-label="Matiz"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(hsv.h)}
          onKeyDown={handleHueKeyDown}
          className="relative h-3 flex-1 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-base/30"
          style={{
            background:
              'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
          }}
        >
          <span
            className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
            style={{ left: `${(hsv.h / 360) * 100}%`, background: `hsl(${hsv.h} 100% 50%)` }}
          />
        </div>
      </div>

      {/* Hex */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="size-8 shrink-0 rounded-lg border border-gray-300"
          style={{ background: hex }}
        />
        <label className="flex h-8 flex-1 items-center gap-1 rounded-lg border border-gray-300 px-2 text-sm leading-5 text-gray-800 focus-within:border-brand-base">
          <span className="text-gray-400">#</span>
          <input
            aria-label="Código hexadecimal da cor"
            value={hexDraft.replace(/^#/, '')}
            maxLength={6}
            onChange={(event) => setHexDraft(`#${event.target.value}`)}
            onBlur={commitHexDraft}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                commitHexDraft()
              }
            }}
            className="w-full min-w-0 bg-transparent uppercase outline-none"
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button variant="solid" size="sm" onClick={() => onApply(hex)}>
          Aplicar
        </Button>
      </div>
    </div>
  )
}
