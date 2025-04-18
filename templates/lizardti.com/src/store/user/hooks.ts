import { useStore } from '@tanstack/react-store'

import { userStore } from './store'

export const useUser = useStore(userStore)
