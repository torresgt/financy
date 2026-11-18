import { LogOut, Mail, UserRound } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Button, Input } from '@/components/ui'

export interface ProfileFormProps {
  name: string
  email: string
  onSignOut: () => void
}

export function ProfileForm({ name: initialName, email, onSignOut }: ProfileFormProps) {
  const [name, setName] = useState(initialName)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
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
          value={email}
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

        <Button variant="outline" size="md" className="w-full" onClick={onSignOut}>
          <LogOut className="size-4.5 text-danger" />
          Sair da conta
        </Button>
      </div>
    </form>
  )
}
