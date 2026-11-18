import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { type SelectOption, SelectField } from '@/components/ui/select'
import { toApiDate } from '@/lib/format'
import type { CreateTransactionInput } from '@/types/api'
import { type TransactionFormValues, transactionFormSchema } from '../schemas/transaction-form'
import { TransactionTypeToggle } from './transaction-type-toggle'

export interface NewTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: SelectOption[]
  onSubmit: (data: CreateTransactionInput) => void | Promise<void>
}

export function NewTransactionDialog({
  open,
  onOpenChange,
  categories,
  onSubmit,
}: NewTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Nova transação" description="Registre sua despesa ou receita">
        {/* O formulário é desmontado ao fechar, então sempre abre limpo. */}
        <TransactionForm
          categories={categories}
          onSubmit={async (data) => {
            await onSubmit(data)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

interface TransactionFormProps {
  categories: SelectOption[]
  onSubmit: (data: CreateTransactionInput) => Promise<void>
}

function TransactionForm({ categories, onSubmit }: TransactionFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: { type: 'EXPENSE', description: '' },
  })

  async function submit(values: TransactionFormValues) {
    await onSubmit({
      type: values.type,
      description: values.description,
      date: toApiDate(values.date),
      amount: values.amount,
      categoryId: values.categoryId,
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6" noValidate>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <TransactionTypeToggle value={field.value} onValueChange={field.onChange} />
        )}
      />

      <div className="flex flex-col gap-4">
        <Input
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          autoComplete="off"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="date"
            render={({ field, fieldState }) => (
              <DatePicker
                label="Data"
                value={field.value}
                onValueChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field, fieldState }) => (
              <CurrencyInput
                ref={field.ref}
                label="Valor"
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <SelectField
              label="Categoria"
              placeholder="Selecione"
              value={field.value}
              onValueChange={field.onChange}
              options={categories}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Button type="submit" variant="solid" size="md" className="w-full" disabled={isSubmitting}>
        Salvar
      </Button>
    </form>
  )
}
