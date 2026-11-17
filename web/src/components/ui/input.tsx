import { Eye, EyeClosed } from 'lucide-react'
import { forwardRef, useId, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends ComponentProps<'input'> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    id,
    type = 'text',
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    disabled,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)

  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
  const hasError = Boolean(error)
  const message = error || helperText

  return (
    <div
      data-slot="input-field"
      data-error={hasError || undefined}
      data-disabled={disabled || undefined}
      className={cn('group flex w-full flex-col gap-2', className)}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-sm leading-5 font-medium text-gray-700 transition-colors',
            'group-focus-within:text-brand-base',
            hasError && 'text-danger group-focus-within:text-danger',
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px] py-[15px] transition-colors',
          'focus-within:border-brand-base',
          hasError && 'border-gray-300 focus-within:border-danger',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {leftIcon && (
          <span
            className={cn(
              'flex size-4 shrink-0 items-center justify-center text-gray-400 transition-colors [&_svg]:size-4',
              'group-focus-within:text-brand-base',
              hasError && 'text-danger group-focus-within:text-danger',
            )}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className={cn(
            'w-full min-w-0 flex-1 bg-transparent text-base leading-[18px] font-normal text-gray-800 caret-brand-base outline-none',
            'placeholder:text-gray-400',
            'disabled:cursor-not-allowed',
          )}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-gray-700 transition-colors hover:text-gray-800 disabled:pointer-events-none [&_svg]:size-4"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        ) : (
          rightIcon && (
            <span className="flex size-4 shrink-0 items-center justify-center text-gray-700 [&_svg]:size-4">
              {rightIcon}
            </span>
          )
        )}
      </div>

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
})
