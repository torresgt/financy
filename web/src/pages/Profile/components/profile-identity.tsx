import { Avatar } from '@/components/ui'

export interface ProfileIdentityProps {
  name: string
  email: string
}

export function ProfileIdentity({ name, email }: ProfileIdentityProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Avatar
        name={name}
        size="lg"
        className="animate-in delay-150 duration-500 ease-spring fill-mode-both zoom-in-75 fade-in"
      />

      <div className="flex flex-col items-center gap-0.5 text-center">
        <h1 className="text-xl leading-7 font-semibold text-gray-800">{name}</h1>
        <p className="text-base leading-6 font-normal text-gray-500">{email}</p>
      </div>
    </div>
  )
}
