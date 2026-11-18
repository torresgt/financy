import { useNavigate } from 'react-router'
import { AppLayout } from '@/components/app-layout'
import { Divider } from '@/components/ui/divider'
import { useAuthStore } from '@/stores/auth'
import { ProfileForm } from './components/profile-form'
import { ProfileIdentity } from './components/profile-identity'
import { FALLBACK_USER } from './constants'

export function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user) ?? FALLBACK_USER
  const signOut = useAuthStore((state) => state.signOut)

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-[12px] border border-gray-200 bg-white p-8">
        <ProfileIdentity name={user.name} email={user.email} />

        <Divider className="border-gray-200" />

        <ProfileForm name={user.name} email={user.email} onSignOut={handleSignOut} />
      </section>
    </AppLayout>
  )
}
