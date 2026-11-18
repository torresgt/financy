import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Mail, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components'
import { Button, Divider, Input } from '@/components/ui'
import { getErrorMessage, getFieldErrors } from '@/lib/graphql-errors'
import type { RequestPasswordResetInput } from '@/types/api'
import { recoverPasswordSchema, type RecoverPasswordFormValues } from '../schemas'
import { REQUEST_PASSWORD_RESET } from './queries'

/** Etapa 1 da recuperação: pede o e-mail e envia o link de redefinição. */
export function RecoverPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)

  const [requestPasswordReset] = useMutation<
    { requestPasswordReset: boolean },
    { data: RequestPasswordResetInput }
  >(REQUEST_PASSWORD_RESET)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit({ email }: RecoverPasswordFormValues) {
    try {
      await requestPasswordReset({ variables: { data: { email } } })
      setSentTo(email)
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      if (fieldErrors.email) setError('email', { message: fieldErrors.email })
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe seu e-mail para receber as instruções de recuperação"
    >
      {sentTo ? (
        <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-base/10 text-brand-base">
            <MailCheck className="size-6" />
          </span>
          <p className="text-base leading-6 font-normal text-gray-700">
            Se existir uma conta com o e-mail{' '}
            <strong className="font-semibold text-gray-800">{sentTo}</strong>, você receberá um
            link para criar uma nova senha.
          </p>
          <p className="text-sm leading-5 font-normal text-gray-500">
            Não recebeu? Verifique a caixa de spam ou{' '}
            <button
              type="button"
              onClick={() => setSentTo(null)}
              className="cursor-pointer font-medium text-brand-base underline-offset-2 hover:underline"
            >
              tente novamente
            </button>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          <Input
            label="E-mail"
            type="email"
            placeholder="mail@exemplo.com"
            autoComplete="email"
            leftIcon={<Mail />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button type="submit" variant="solid" size="md" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>
      )}

      <Divider label="ou" />

      <div className="flex flex-col gap-4">
        <p className="text-center text-sm leading-5 font-normal text-gray-600">Lembrou sua senha?</p>

        <Button asChild variant="outline" size="md" className="w-full">
          <Link to="/">
            <LogIn />
            Voltar para o login
          </Link>
        </Button>
      </div>
    </AuthLayout>
  )
}
