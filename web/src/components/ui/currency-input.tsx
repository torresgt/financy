import { forwardRef, type ChangeEvent } from 'react'
import { Input, type InputProps } from '@/components/ui/input'

const amountFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Maior valor aceito (R$ 999.999.999,99) para evitar perda de precisão. */
const MAX_CENTS = 99_999_999_999

export interface CurrencyInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'type' | 'defaultValue'> {
  /** Valor em reais. `undefined`/0 exibe o placeholder. */
  value?: number
  onValueChange?: (value: number) => void
}

/**
 * Campo monetário em BRL: o usuário digita apenas números e o valor
 * é preenchido da direita para a esquerda (centavos primeiro).
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    { value, onValueChange, placeholder = '0,00', leftAddon = 'R$', ...props },
    ref,
  ) {
    const displayValue = value ? amountFormatter.format(value) : ''

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const digits = event.target.value.replace(/\D/g, '')
      const cents = Math.min(Number(digits || '0'), MAX_CENTS)
      onValueChange?.(cents / 100)
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        leftAddon={leftAddon}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
