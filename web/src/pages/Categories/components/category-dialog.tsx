import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Dialog, DialogContent, Input } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoryFormSchema, type CategoryFormValues } from '../schemas/category-form'
import { DEFAULT_CATEGORY_COLOR, DEFAULT_CATEGORY_ICON } from '../constants'
import { CategoryIconPicker } from './category-icon-picker'
import { CategoryColorPicker } from './category-color-picker'
import type { Category, CreateCategoryInput } from '@/types/api'

export interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Categoria a editar; sem ela, o modal cria uma nova. */
  category?: Category | null
  /** Se rejeitar, o modal continua aberto (quem chama exibe o erro). */
  onSubmit: (data: CreateCategoryInput) => void | Promise<void>
}

export function CategoryDialog({ open, onOpenChange, category, onSubmit }: CategoryDialogProps) {
  const isEditing = !!category

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={isEditing ? 'Editar categoria' : 'Nova categoria'}
        description={
          isEditing ? 'Atualize os dados da categoria' : 'Organize suas transações com categorias'
        }
      >
        {/* O formulário é desmontado ao fechar, então sempre abre com os valores certos. */}
        <CategoryForm
          category={category}
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

interface CategoryFormProps {
  category?: Category | null
  onSubmit: (data: CreateCategoryInput) => Promise<void>
}

function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const iconLabelId = useId()
  const colorLabelId = useId()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: category?.title ?? '',
      description: category?.description ?? '',
      icon: category?.icon ?? DEFAULT_CATEGORY_ICON,
      color: category?.color ?? DEFAULT_CATEGORY_COLOR,
    },
  })

  async function submit(values: CategoryFormValues) {
    await onSubmit({
      title: values.title,
      description: values.description || null,
      icon: values.icon,
      color: values.color,
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4">
        <Input
          label="Título"
          placeholder="Ex. Alimentação"
          autoComplete="off"
          error={errors.title?.message}
          {...register('title')}
        />

        <Input
          label="Descrição"
          placeholder="Descrição da categoria"
          autoComplete="off"
          helperText="Opcional"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex flex-col gap-2">
          <span id={iconLabelId} className="text-sm leading-5 font-medium text-gray-700">
            Ícone
          </span>
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <CategoryIconPicker
                aria-labelledby={iconLabelId}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span id={colorLabelId} className="text-sm leading-5 font-medium text-gray-700">
            Cor
          </span>
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <CategoryColorPicker
                aria-labelledby={colorLabelId}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <Button type="submit" variant="solid" size="md" className="w-full" disabled={isSubmitting}>
        Salvar
      </Button>
    </form>
  )
}
