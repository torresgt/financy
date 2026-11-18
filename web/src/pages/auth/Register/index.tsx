import { Lock, LogIn, Mail, UserRound } from 'lucide-react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Input } from '@/components/ui/input'

export function RegisterPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a controlar suas finanças ainda hoje">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            type="text"
            placeholder="Seu nome completo"
            autoComplete="name"
            leftIcon={<UserRound />}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="mail@exemplo.com"
            autoComplete="email"
            leftIcon={<Mail />}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            autoComplete="new-password"
            helperText="A senha deve ter no mínimo 8 caracteres"
            leftIcon={<Lock />}
          />
        </div>

        <Button type="submit" variant="solid" size="md" className="w-full">
          Cadastrar
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
