import { LogOut, Mail, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { AppLayout } from '@/components/app-layout'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'

const FALLBACK_USER = { name: 'Conta teste', email: 'conta@teste.com' }

export function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user) ?? FALLBACK_USER
  const signOut = useAuthStore((state) => state.signOut)
  const [name, setName] = useState(user.name)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-[12px] border border-gray-200 bg-white p-8">
        {/* Identificação */}
        <div className="flex flex-col items-center gap-6">
          <Avatar name={user.name} size="lg" />

          <div className="flex flex-col items-center gap-0.5 text-center">
            <h1 className="text-xl leading-7 font-semibold text-gray-800">{user.name}</h1>
            <p className="text-base leading-6 font-normal text-gray-500">{user.email}</p>
          </div>
        </div>

        <Divider className="border-gray-200" />

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div className="flex flex-col gap-4">
            <Input
              label="Nome completo"
              placeholder="Seu nome completo"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              leftIcon={<UserRound />}
            />

            <Input
              label="E-mail"
              type="email"
              value={user.email}
              disabled
              readOnly
              leftIcon={<Mail />}
              helperText="O e-mail não pode ser alterado"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" variant="solid" size="md" className="w-full">
              Salvar alterações
            </Button>

            <Button variant="outline" size="md" className="w-full" onClick={handleSignOut}>
              <LogOut className="size-[18px] text-danger" />
              Sair da conta
            </Button>
          </div>
        </form>
      </section>
    </AppLayout>
  )
}
