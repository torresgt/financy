import { Plus } from 'lucide-react'
import { Popover as PopoverPrimitive, RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { useState } from 'react'
import { ColorPickerPanel } from '@/components/ui/color-picker-panel'
import type { CategoryColor } from '@/components/ui/tag'
import { isHexColor } from '@/lib/color'
import { cn } from '@/lib/utils'

export const CATEGORY_COLOR_OPTIONS: { value: CategoryColor; label: string; swatch: string }[] = [
  { value: 'green', label: 'Verde', swatch: 'bg-green-base' },
  { value: 'blue', label: 'Azul', swatch: 'bg-blue-base' },
  { value: 'purple', label: 'Roxo', swatch: 'bg-purple-base' },
  { value: 'pink', label: 'Rosa', swatch: 'bg-pink-base' },
  { value: 'red', label: 'Vermelho', swatch: 'bg-red-base' },
  { value: 'orange', label: 'Laranja', swatch: 'bg-orange-base' },
  { value: 'yellow', label: 'Amarelo', swatch: 'bg-yellow-base' },
]

const CUSTOM_VALUE = 'custom'

const tileClasses = cn(
  'flex h-8 cursor-pointer items-stretch rounded-lg border border-gray-300 bg-white p-1 transition-colors outline-none',
  'hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-brand-base/30',
  'data-[state=checked]:border-brand-base data-[state=checked]:bg-gray-100',
)

export interface CategoryColorPickerProps {
  /** Nome de uma cor da paleta (ex.: "green") ou hexadecimal personalizado (#rrggbb). */
  value?: string
  onValueChange?: (color: string) => void
  className?: string
  'aria-labelledby'?: string
}

export function CategoryColorPicker({
  value,
  onValueChange,
  className,
  ...props
}: CategoryColorPickerProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const customColor = isHexColor(value) ? value : undefined

  function handleApply(hex: string) {
    onValueChange?.(hex)
    setPanelOpen(false)
  }

  return (
    <RadioGroupPrimitive.Root
      value={customColor ? CUSTOM_VALUE : value}
      onValueChange={(next) => {
        // A opção personalizada só é aplicada pelo botão "Aplicar" do painel.
        if (next !== CUSTOM_VALUE) onValueChange?.(next)
      }}
      className={cn('grid grid-cols-8 gap-2', className)}
      {...props}
    >
      {CATEGORY_COLOR_OPTIONS.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className={tileClasses}
        >
          <span className={cn('flex-1 rounded', option.swatch)} />
        </RadioGroupPrimitive.Item>
      ))}

      {/* Cor personalizada: abre o painel do seletor de cores */}
      <PopoverPrimitive.Root open={panelOpen} onOpenChange={setPanelOpen}>
        <PopoverPrimitive.Trigger asChild>
          <RadioGroupPrimitive.Item
            value={CUSTOM_VALUE}
            aria-label={customColor ? `Cor personalizada ${customColor}` : 'Escolher cor personalizada'}
            title="Cor personalizada"
            className={tileClasses}
          >
            <span
              className="flex flex-1 items-center justify-center rounded text-white"
              style={{
                background:
                  customColor ??
                  'conic-gradient(from 180deg, #ef4444, #eab308, #22c55e, #06b6d4, #3b82f6, #a855f7, #ef4444)',
              }}
            >
              {!customColor && <Plus className="size-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.6)]" />}
            </span>
          </RadioGroupPrimitive.Item>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="top"
            align="end"
            sideOffset={8}
            collisionPadding={16}
            className={cn(
              'z-50 rounded-lg border border-gray-300 bg-white p-3 shadow-[0px_4px_7.5px_rgba(0,0,0,0.1)] outline-none',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
          >
            <ColorPickerPanel
              initialColor={customColor}
              onApply={handleApply}
              onCancel={() => setPanelOpen(false)}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </RadioGroupPrimitive.Root>
  )
}
