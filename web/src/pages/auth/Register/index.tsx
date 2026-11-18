import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, LogIn, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components'
import { Button, Divider, Input } from '@/components/ui'
import { getErrorMessage, getFieldErrors } from '@/lib/graphql-errors'
import { useAuthStore } from '@/stores/auth'
import type { AuthPayload, RegisterInput } from '@/types/api'
import { registerSchema, type RegisterFormValues } from '../schemas'
import { REGISTER } from './queries'

export function RegisterPage() {
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)

  const [registerUser] = useMutation<{ register: AuthPayload }, { data: RegisterInput }>(REGISTER)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(values: RegisterFormValues) {
    try {
      const { data } = await registerUser({ variables: { data: values } })
      if (!data) return

      signIn(data.register)
      toast.success(`Conta criada! Bem-vindo(a), ${data.register.user.name.split(' ')[0]}.`)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      for (const field of ['name', 'email', 'password'] as const) {
        if (fieldErrors[field]) setError(field, { message: fieldErrors[field] })
      }

      const message = getErrorMessage(error)
      // E-mail já cadastrado (CONFLICT): destaca o campo em vez de só o toast
      if (message.toLowerCase().includes('e-mail') && !fieldErrors.email) {
        setError('email', { message })
      }
      toast.error(message)
    }
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a controlar suas finanças ainda hoje">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            type="text"
            placeholder="Seu nome completo"
            autoComplete="name"
            leftIcon={<UserRound />}
            error={errors.name?.message}
            {...register('name')}
          />

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
            autoComplete="new-password"
            helperText="A senha deve ter no mínimo 8 caracteres"
            leftIcon={<Lock />}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button type="submit" variant="solid" size="md" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>

        <Divider label="ou" />

        <div className="flex flex-col gap-4">
          <p className="text-center text-sm leading-5 font-normal text-gray-600">
            Já tem uma conta?
          </p>

          <Button asChild variant="outline" size="md" className="w-full">
            <Link to="/">
              <LogIn />
              Fazer login
            </Link>
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
