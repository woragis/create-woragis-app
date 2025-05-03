import { Store } from '@tanstack/react-store'
import Cookies from 'js-cookie'

import type { User, UserState } from './types'

const getUserFromCookies = (): User | null => {
  const userCookie = Cookies.get('user')
  return userCookie ? JSON.parse(userCookie) : null
}

const initialState: UserState = {
  user: getUserFromCookies(),
  isAuthenticated: false
}

export const userStore = new Store(initialState)
