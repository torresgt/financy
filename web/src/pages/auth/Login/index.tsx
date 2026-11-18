import { Lock, Mail, UserRoundPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { AuthLayout } from '@/components'
import { Button, Checkbox, Divider, Input, TextLink } from '@/components/ui'

export function LoginPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout title="Fazer login" subtitle="Entre na sua conta para continuar">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-4">
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
            autoComplete="current-password"
            leftIcon={<Lock />}
          />

          <div className="flex items-center justify-between">
            <label className="inline-flex cursor-pointer items-center gap-2 select-none">
              <Checkbox id="remember-me" />
              <span className="text-sm leading-5 font-normal text-gray-700">Lembrar-me</span>
            </label>

            <TextLink to="/recuperar-senha">Recuperar senha</TextLink>
          </div>
        </div>

        <Button type="submit" variant="solid" size="md" className="w-full">
          Entrar
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
