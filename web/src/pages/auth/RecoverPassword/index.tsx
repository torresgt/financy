import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Lock, LogIn, Mail, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components'
import { Button, Divider, Input } from '@/components/ui'
import { getErrorMessage, getFieldErrors } from '@/lib/graphql-errors'
import type { ConfirmPasswordResetInput, RequestPasswordResetInput } from '@/types/api'
import {
  recoverPasswordSchema,
  resetCodeSchema,
  type RecoverPasswordFormValues,
  type ResetCodeFormValues,
} from '../schemas'
import { CONFIRM_PASSWORD_RESET, REQUEST_PASSWORD_RESET } from './queries'

const FIELDS = ['email', 'newPassword', 'confirmPassword'] as const

export function RecoverPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle={
        sentTo
          ? 'Digite o código que enviamos por e-mail para confirmar a nova senha'
          : 'Informe seu e-mail e a nova senha. Enviaremos um código para confirmar a alteração'
      }
    >
      {sentTo ? (
        <ResetCodeStep email={sentTo} onRetry={() => setSentTo(null)} />
      ) : (
        <RequestStep onSent={setSentTo} />
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

function RequestStep({ onSent }: { onSent: (email: string) => void }) {
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
    defaultValues: { email: '', newPassword: '', confirmPassword: '' },
  })

  async function onSubmit(values: RecoverPasswordFormValues) {
    try {
      await requestPasswordReset({ variables: { data: values } })
      onSent(values.email)
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      for (const field of FIELDS) {
        if (fieldErrors[field]) setError(field, { message: fieldErrors[field] })
      }
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="mail@exemplo.com"
          autoComplete="email"
          leftIcon={<Mail />}
          error={errors.email?.message}
          {...register('email')}
        />

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
        {isSubmitting ? 'Enviando...' : 'Enviar código'}
      </Button>
    </form>
  )
}

function ResetCodeStep({ email, onRetry }: { email: string; onRetry: () => void }) {
  const navigate = useNavigate()

  const [confirmPasswordReset] = useMutation<
    { confirmPasswordReset: boolean },
    { data: ConfirmPasswordResetInput }
  >(CONFIRM_PASSWORD_RESET)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetCodeFormValues>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: { code: '' },
  })

  async function onSubmit({ code }: ResetCodeFormValues) {
    try {
      await confirmPasswordReset({ variables: { data: { email, code } } })
      toast.success('Senha redefinida com sucesso', {
        description: 'Faça login com a sua nova senha.',
      })
      navigate('/', { replace: true })
    } catch (error) {
      const message = getFieldErrors(error).code ?? getErrorMessage(error)
      setError('code', { message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-base/10 text-brand-base">
          <MailCheck className="size-6" />
        </span>
        <p className="text-base leading-6 font-normal text-gray-700">
          Se existir uma conta com o e-mail{' '}
          <strong className="font-semibold text-gray-800">{email}</strong>, você receberá um
          código de 6 dígitos para confirmar a nova senha.
        </p>
        <p className="text-sm leading-5 font-normal text-gray-500">
          Até a confirmação, a senha atual continua valendo.
        </p>
      </div>

      <Input
        label="Código de confirmação"
        placeholder="000000"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus
        leftIcon={<KeyRound />}
        error={errors.code?.message}
        {...register('code')}
      />

      <Button type="submit" variant="solid" size="md" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Confirmando...' : 'Confirmar nova senha'}
      </Button>

      <p className="text-center text-sm leading-5 font-normal text-gray-500">
        Não recebeu? Verifique a caixa de spam ou{' '}
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer font-medium text-brand-base underline-offset-2 hover:underline"
        >
          solicite um novo código
        </button>
        .
      </p>
    </form>
  )
}
