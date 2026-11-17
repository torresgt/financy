import { Check, ChevronDown } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectFieldProps {
  id?: string
  label?: string
  helperText?: string
  error?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  leftIcon?: ReactNode
  disabled?: boolean
  className?: string
}

export function SelectField({
  id,
  label,
  helperText,
  error,
  placeholder = 'Selecione',
  value,
  defaultValue,
  onValueChange,
  options,
  leftIcon,
  disabled,
  className,
}: SelectFieldProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const hasError = Boolean(error)
  const message = error || helperText

  return (
    <div
      data-slot="select-field"
      data-error={hasError || undefined}
      data-disabled={disabled || undefined}
      className={cn('group flex w-full flex-col gap-2', className)}
    >
      {label && (
        <label
          htmlFor={triggerId}
          className={cn(
            'text-sm leading-5 font-medium text-gray-700 transition-colors',
            'group-focus-within:text-brand-base',
            hasError && 'text-danger group-focus-within:text-danger',
          )}
        >
          {label}
        </label>
      )}

      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={triggerId}
          aria-invalid={hasError || undefined}
          className={cn(
            'flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px] py-[15px] text-left text-base leading-[18px] font-normal text-gray-800 transition-colors outline-none',
            'focus:border-brand-base data-[state=open]:border-brand-base',
            'data-[placeholder]:text-gray-400',
            hasError &&
              'border-gray-300 focus:border-danger data-[state=open]:border-danger',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {leftIcon && (
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center text-gray-700 transition-colors [&_svg]:size-4',
                'group-focus-within:text-brand-base',
                hasError && 'text-danger group-focus-within:text-danger',
              )}
            >
              {leftIcon}
            </span>
          )}

          <span className="min-w-0 flex-1 truncate">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>

          <SelectPrimitive.Icon asChild>
            <ChevronDown className="size-4 shrink-0 text-gray-700 transition-transform duration-150 [[data-state=open]_&]:rotate-180" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={8}
            className={cn(
              'z-50 max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-gray-300 bg-white shadow-[0px_4px_7.5px_rgba(0,0,0,0.1)]',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
          >
            <SelectPrimitive.Viewport className="flex flex-col gap-4 px-[13px] py-[15px]">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-2 text-base leading-[18px] font-normal text-gray-800 outline-none select-none',
                    'focus:text-brand-base data-[state=checked]:font-medium',
                  )}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="flex size-5 shrink-0 items-center justify-center text-success">
                    <Check className="size-5" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {message && (
        <p
          className={cn(
            'text-xs leading-4 font-normal text-gray-500',
            hasError && 'text-danger',
          )}
        >
          {message}
        </p>
      )}
    </div>
  )
}
