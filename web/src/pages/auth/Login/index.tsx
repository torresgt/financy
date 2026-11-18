import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, UserRoundPlus } from 'lucide-react'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components'
import { Button, Checkbox, Divider, Input, TextLink } from '@/components/ui'
import { getErrorMessage, getFieldErrors } from '@/lib/graphql-errors'
import { useAuthStore } from '@/stores/auth'
import type { AuthPayload, LoginInput } from '@/types/api'
import { loginSchema, type LoginFormValues } from '../schemas'
import { LOGIN } from './queries'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const signIn = useAuthStore((state) => state.signIn)
  const rememberId = useId()

  const [login] = useMutation<{ login: AuthPayload }, { data: LoginInput }>(LOGIN)

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  async function onSubmit({ email, password, remember }: LoginFormValues) {
    try {
      const { data } = await login({ variables: { data: { email, password } } })
      if (!data) return

      signIn(data.login, { remember })

      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/dashboard', { replace: true })
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      for (const field of ['email', 'password'] as const) {
        if (fieldErrors[field]) setError(field, { message: fieldErrors[field] })
      }
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout title="Fazer login" subtitle="Entre na sua conta para continuar">
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
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            autoComplete="current-password"
            leftIcon={<Lock />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <Controller
                control={control}
                name="remember"
                render={({ field }) => (
                  <Checkbox
                    id={rememberId}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
              <label
                htmlFor={rememberId}
                className="cursor-pointer text-sm leading-5 font-normal text-gray-700 select-none"
              >
                Lembrar-me
              </label>
            </div>

            <TextLink to="/recuperar-senha">Recuperar senha</TextLink>
          </div>
        </div>

        <Button type="submit" variant="solid" size="md" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>

        <Divider label="ou" />

        <div className="flex flex-col gap-4">
          <p className="text-center text-sm leading-5 font-normal text-gray-600">
            Ainda não tem uma conta?
          </p>

          <Button asChild variant="outline" size="md" className="w-full">
            <Link to="/cadastro">
              <UserRoundPlus />
              Criar conta
            </Link>
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
