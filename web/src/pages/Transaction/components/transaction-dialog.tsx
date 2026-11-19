import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  CurrencyInput,
  DatePicker,
  Dialog,
  DialogContent,
  Input,
  type SelectOption,
  SelectField,
} from '@/components/ui'
import { parseApiDate, toApiDate } from '@/lib/format'
import type { CreateTransactionInput, Transaction } from '@/types/api'
import { type TransactionFormValues, transactionFormSchema } from '../schemas/transaction-form'
import { TransactionTypeToggle } from './transaction-type-toggle'

export interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: SelectOption[]
  /** Transação a editar; sem ela, o modal cria uma nova. */
  transaction?: Transaction | null
  onSubmit: (data: CreateTransactionInput) => void | Promise<void>
}

export function TransactionDialog({
  open,
  onOpenChange,
  categories,
  transaction,
  onSubmit,
}: TransactionDialogProps) {
  const isEditing = !!transaction

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={isEditing ? 'Editar transação' : 'Nova transação'}
        description={
          isEditing ? 'Atualize os dados da transação' : 'Registre sua despesa ou receita'
        }
      >
        {/* O formulário é desmontado ao fechar, então sempre abre com os valores certos. */}
        <TransactionForm
          categories={categories}
          transaction={transaction}
          onSubmit={async (data) => {
            try {
              await onSubmit(data)
              onOpenChange(false)
            } catch {
              // Mantém o modal aberto; o erro já foi exibido por quem chamou.
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

interface TransactionFormProps {
  categories: SelectOption[]
  transaction?: Transaction | null
  onSubmit: (data: CreateTransactionInput) => Promise<void>
}

function TransactionForm({ categories, transaction, onSubmit }: TransactionFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          description: transaction.description,
          date: parseApiDate(transaction.date),
          amount: transaction.amount,
          categoryId: transaction.category?.id ?? '',
        }
      : { type: 'EXPENSE', description: '', categoryId: '' },
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
