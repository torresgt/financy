import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Dialog, DialogContent, Input } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoryFormSchema, type CategoryFormValues } from '../schemas/category-form'
import { DEFAULT_CATEGORY_COLOR, DEFAULT_CATEGORY_ICON } from '../constants'
import { CategoryIconPicker } from './category-icon-picker'
import { CategoryColorPicker } from './category-color-picker'
import type { CreateCategoryInput } from '@/types/api'


export interface NewCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCategoryInput) => void | Promise<void>
}

export function NewCategoryDialog({ open, onOpenChange, onSubmit }: NewCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Nova categoria" description="Organize suas transações com categorias">
        {/* O formulário é desmontado ao fechar, então sempre abre limpo. */}
        <CategoryForm
          onSubmit={async (data) => {
            await onSubmit(data)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

interface CategoryFormProps {
  onSubmit: (data: CreateCategoryInput) => Promise<void>
}

function CategoryForm({ onSubmit }: CategoryFormProps) {
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
      title: '',
      description: '',
      icon: DEFAULT_CATEGORY_ICON,
      color: DEFAULT_CATEGORY_COLOR,
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
