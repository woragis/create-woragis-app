import Cookies from 'js-cookie'
import { create } from 'zustand'
import { User } from '../types/userType'
import { logout } from '../services/api'

interface AuthStore {
  state: {
    user: User | null
    isAuthenticated: boolean
  }
  dispatch: {
    setUser: (userData: User) => void
    logOut: () => void
  }
}

const getUserFromCookies = (): User | null => {
  const userCookie = Cookies.get('user')
  return userCookie ? JSON.parse(userCookie) : null
}

export const useAuthStore = create<AuthStore>((set) => {
  return {
    state: {
      user: getUserFromCookies(),
      isAuthenticated: getUserFromCookies() ? true : false,
      registerCompleted: false
    },
    dispatch: {
      setUser: (userData: User) => {
        set(() => ({
          state: {
            user: userData,
            isAuthenticated: true
          }
        }))
        Cookies.set('user', JSON.stringify(userData))
      },
      logOut: () => {
        set(() => ({
          state: {
            user: null,
            isAuthenticated: false
          }
        }))
        Cookies.remove('user')
        logout()
      }
    }
  }
})
