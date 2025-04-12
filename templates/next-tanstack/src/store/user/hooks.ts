import { useStore } from '@tanstack/react-store'
import { userStore } from './store'

export const useUser = () => {
  const user = useStore(userStore, (s) => s.user)
  const loading = useStore(userStore, (s) => s.loading)

  return { user, loading }
}
