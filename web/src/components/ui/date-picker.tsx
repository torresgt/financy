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
  // Direção da última navegação, para os dias entrarem pelo lado certo.
  const [direction, setDirection] = useState<'prev' | 'next' | null>(null)

  function goToMonth(next: 'prev' | 'next') {
    setDirection(next)
    setMonth((current) => (next === 'next' ? addMonths(current, 1) : subMonths(current, 1)))
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  })

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDirection(null)
      setMonth(startOfMonth(value ?? new Date()))
    }
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
            'flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white px-3.25 py-3.75 text-left text-base leading-4.5 font-normal transition-[border-color,box-shadow] duration-200 ease-out outline-none',
            'focus:border-brand-base focus:ring-4 focus:ring-brand-base/10 data-[state=open]:border-brand-base data-[state=open]:ring-4 data-[state=open]:ring-brand-base/10',
            value ? 'text-gray-800' : 'text-gray-400',
            hasError &&
              'focus:border-danger focus:ring-danger/10 data-[state=open]:border-danger data-[state=open]:ring-danger/10',
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
              'z-50 flex w-70 flex-col gap-3 overflow-hidden rounded-lg border border-gray-300 bg-white p-3 shadow-[0px_4px_7.5px_rgba(0,0,0,0.1)] outline-none',
              'origin-(--radix-popover-content-transform-origin) duration-200 ease-out-expo',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
            )}
          >
            <div className="flex items-center justify-between">
              <IconButton aria-label="Mês anterior" onClick={() => goToMonth('prev')}>
                <ChevronLeft />
              </IconButton>
              <span
                key={month.toISOString()}
                aria-live="polite"
                className="animate-in text-sm leading-5 font-semibold text-gray-800 capitalize duration-300 fade-in"
              >
                {format(month, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <IconButton aria-label="Próximo mês" onClick={() => goToMonth('next')}>
                <ChevronRight />
              </IconButton>
            </div>

            <div
              key={month.toISOString()}
              className={cn(
                'grid grid-cols-7 gap-1 text-center',
                direction && 'animate-in duration-300 ease-out-expo fade-in',
                direction === 'next' && 'slide-in-from-right-6',
                direction === 'prev' && 'slide-in-from-left-6',
              )}
            >
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
                      'flex h-9 cursor-pointer items-center justify-center rounded-lg text-sm leading-5 transition-[color,background-color,scale] duration-200 ease-out outline-none hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-brand-base/30 active:scale-90',
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
