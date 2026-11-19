import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AppLayout } from '@/components'
import { Divider } from '@/components/ui'
import { apolloClient } from '@/lib/apollo'
import { getErrorMessage } from '@/lib/graphql-errors'
import { ENTER_ANIMATION } from '@/lib/motion'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/api'
import { ProfileForm, ProfileIdentity } from './components'
import { ME, UPDATE_PROFILE } from './queries'

export function ProfilePage() {
  const navigate = useNavigate()
  const storedUser = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const signOut = useAuthStore((state) => state.signOut)

  const { data } = useQuery<{ me: User }>(ME)
  const [updateProfile] = useMutation<{ updateProfile: User }, { data: { name: string } }>(
    UPDATE_PROFILE,
  )

  useEffect(() => {
    if (data?.me) setUser(data.me)
  }, [data, setUser])

  const user = data?.me ?? storedUser

  async function handleSave(name: string) {
    try {
      const result = await updateProfile({ variables: { data: { name } } })
      if (result.data) setUser(result.data.updateProfile)
      toast.success('Perfil atualizado com sucesso')
    } catch (error) {
      toast.error(getErrorMessage(error))
      throw error
    }
  }

  function handleSignOut() {
    signOut()
    void apolloClient.clearStore()
    navigate('/', { replace: true })
  }

  return (
    <AppLayout>
      <section
        className={`${ENTER_ANIMATION} mx-auto flex w-full max-w-md flex-col gap-8 rounded-[12px] border border-gray-200 bg-white p-8`}
      >
        {user ? (
          <>
            <ProfileIdentity name={user.name} email={user.email} />

            <Divider className="border-gray-200" />

            <ProfileForm
              name={user.name}
              email={user.email}
              onSave={handleSave}
              onSignOut={handleSignOut}
            />
          </>
        ) : (
          <div className="flex justify-center py-8" aria-busy>
            <span className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-base" />
          </div>
        )}
      </section>
    </AppLayout>
  )
}
