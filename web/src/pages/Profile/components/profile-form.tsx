import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'

const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export interface ProfileFormProps {
  name: string
  email: string
  /** Salva o novo nome. Se rejeitar, o formulário mantém o valor digitado. */
  onSave: (name: string) => Promise<void>
  onSignOut: () => void
}

export function ProfileForm({ name, email, onSave, onSignOut }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: { name },
  })

  async function submit(values: ProfileFormValues) {
    try {
      await onSave(values.name)
      reset({ name: values.name })
    } catch {
      // O erro já foi exibido por quem chamou.
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4">
        <Input
          label="Nome completo"
          placeholder="Seu nome completo"
          autoComplete="name"
          leftIcon={<UserRound />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="E-mail"
          type="email"
          value={email}
          disabled
          readOnly
          leftIcon={<Mail />}
          helperText="O e-mail não pode ser alterado"
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          variant="solid"
          size="md"
          className="w-full"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </Button>

        <Button variant="outline" size="md" className="w-full" onClick={onSignOut}>
          <LogOut className="size-4.5 text-danger" />
          Sair da conta
        </Button>
      </div>
    </form>
  )
}
