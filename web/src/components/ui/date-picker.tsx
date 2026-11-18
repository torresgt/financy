import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { useId, useState } from 'react'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export interface DatePickerProps {
  id?: string
  label?: string
  helperText?: string
  error?: string
  placeholder?: string
  value?: Date
  onValueChange?: (date: Date) => void
  disabled?: boolean
  className?: string
}

export function DatePicker({
  id,
  label,
  helperText,
  error,
  placeholder = 'Selecione',
  value,
  onValueChange,
  disabled,
  className,
}: DatePickerProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const hasError = Boolean(error)
  const message = error || helperText

  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => startOfMonth(value ?? new Date()))

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  })

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setMonth(startOfMonth(value ?? new Date()))
    setOpen(nextOpen)
  }

  function handleSelect(day: Date) {
    onValueChange?.(day)
    setOpen(false)
  }

  return (
    <div
      data-slot="date-picker"
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

      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <PopoverPrimitive.Trigger
          id={triggerId}
          type="button"
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className={cn(
            'flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px] py-[15px] text-left text-base leading-[18px] font-normal transition-colors outline-none',
            'focus:border-brand-base data-[state=open]:border-brand-base',
            value ? 'text-gray-800' : 'text-gray-400',
            hasError && 'focus:border-danger data-[state=open]:border-danger',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <span className="min-w-0 flex-1 truncate">
            {value ? format(value, 'dd/MM/yyyy') : placeholder}
          </span>
          <CalendarDays className="size-4 shrink-0 text-gray-400" />
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className={cn(
              'z-50 flex w-[280px] flex-col gap-3 rounded-lg border border-gray-300 bg-white p-3 shadow-[0px_4px_7.5px_rgba(0,0,0,0.1)] outline-none',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
          >
            <div className="flex items-center justify-between">
              <IconButton aria-label="Mês anterior" onClick={() => setMonth((m) => subMonths(m, 1))}>
                <ChevronLeft />
              </IconButton>
              <span className="text-sm leading-5 font-semibold text-gray-800 capitalize">
                {format(month, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <IconButton aria-label="Próximo mês" onClick={() => setMonth((m) => addMonths(m, 1))}>
                <ChevronRight />
              </IconButton>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((weekday, index) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: dias da semana fixos
                  key={index}
                  className="py-1 text-xs leading-4 font-medium text-gray-500"
                >
                  {weekday}
                </span>
              ))}

              {days.map((day) => {
                const selected = value ? isSameDay(day, value) : false
                const outside = !isSameMonth(day, month)

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => handleSelect(day)}
                    aria-pressed={selected}
                    aria-label={format(day, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    className={cn(
                      'flex h-9 cursor-pointer items-center justify-center rounded-lg text-sm leading-5 transition-colors outline-none hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-brand-base/30',
                      outside ? 'text-gray-400' : 'text-gray-800',
                      isToday(day) && !selected && 'font-semibold text-brand-base',
                      selected && 'bg-brand-base font-medium text-white hover:bg-brand-dark',
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                )
              })}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

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
