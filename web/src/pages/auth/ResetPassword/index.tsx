import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, LogIn, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components'
import { Button, Divider, Input } from '@/components/ui'
import { getErrorMessage, getFieldErrors } from '@/lib/graphql-errors'
import type { ResetPasswordInput } from '@/types/api'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas'
import { RESET_PASSWORD } from './queries'

/** Etapa 2 da recuperação: aberta pelo link do e-mail (`?token=...`). */
export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''

  return (
    <AuthLayout title="Redefinir senha" subtitle="Crie uma nova senha para a sua conta">
      {token ? <ResetPasswordForm token={token} /> : <InvalidLink />}

      <Divider label="ou" />

      <Button asChild variant="outline" size="md" className="w-full">
        <Link to="/">
          <LogIn />
          Voltar para o login
        </Link>
      </Button>
    </AuthLayout>
  )
}

function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate()

  const [resetPassword] = useMutation<{ resetPassword: boolean }, { data: ResetPasswordInput }>(
    RESET_PASSWORD,
  )

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      await resetPassword({ variables: { data: { token, ...values } } })
      toast.success('Senha redefinida com sucesso', {
        description: 'Faça login com a sua nova senha.',
      })
      navigate('/', { replace: true })
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      for (const field of ['newPassword', 'confirmPassword'] as const) {
        if (fieldErrors[field]) setError(field, { message: fieldErrors[field] })
      }
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4">
        <Input
          label="Nova senha"
          type="password"
          placeholder="Digite a nova senha"
          autoComplete="new-password"
          helperText="A senha deve ter no mínimo 8 caracteres"
          leftIcon={<Lock />}
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          leftIcon={<Lock />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <Button type="submit" variant="solid" size="md" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
      </Button>
    </form>
  )
}

function InvalidLink() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <TriangleAlert className="size-6" />
      </span>
      <p className="text-base leading-6 font-normal text-gray-700">
        Este link de recuperação é inválido. Solicite um novo link para redefinir sua senha.
      </p>
      <Button asChild variant="solid" size="md" className="w-full">
        <Link to="/recuperar-senha">Solicitar novo link</Link>
      </Button>
    </div>
  )
}
