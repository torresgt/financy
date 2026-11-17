import { LogIn, Mail } from 'lucide-react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Input } from '@/components/ui/input'

export function ForgotPasswordPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe seu e-mail para receber as instruções de recuperação"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="mail@exemplo.com"
            autoComplete="email"
            leftIcon={<Mail />}
          />
        </div>

        <Button type="submit" variant="solid" size="md" className="w-full">
          Enviar link de recuperação
        </Button>

        <Divider label="ou" />

        <div className="flex flex-col gap-4">
          <p className="text-center text-sm leading-5 font-normal text-gray-600">
            Lembrou sua senha?
          </p>

          <Button asChild variant="outline" size="md" className="w-full">
            <Link to="/">
              <LogIn />
              Voltar para o login
            </Link>
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
