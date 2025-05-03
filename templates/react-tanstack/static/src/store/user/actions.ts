import { userStore } from '../store/userStore'
import { User } from './types'

// Simulate login
export async function loginUser(email: string, password: string) {
  userStore.setState((s) => ({ ...s, loading: true }))

  try {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    const fakeUser: User = {
      id: '1',
      name: 'John Doe',
      email,
    }

    userStore.setState((s) => ({
      ...s,
      user: fakeUser,
      loading: false,
    }))
  } catch (e) {
    userStore.setState((s) => ({ ...s, loading: false }))
    throw e
  }
}

export function logoutUser() {
  userStore.setState((s) => ({
    ...s,
    user: null,
  }))
}
