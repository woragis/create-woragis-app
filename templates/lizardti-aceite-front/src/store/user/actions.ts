import Cookies from 'js-cookie'

import { userStore } from './store'
import type { User } from './types'

export const setUser = (userData: User) => {
  userStore.setState((state) => ({
    ...state,
    user: userData,
    isAuthenticated: true
  }))
  Cookies.set('user', JSON.stringify(userData))
}

export const logout = () => {
  userStore.setState((state) => ({
    ...state,
    user: null,
    isAuthenticated: false
  }))
  Cookies.remove('user')
}
