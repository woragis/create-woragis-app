import { createStore } from '@tanstack/react-store'
import { User } from './types'

interface UserState {
  user: User | null
  loading: boolean
}

export const userStore = createStore<UserState>({
  user: null,
  loading: false,
})
