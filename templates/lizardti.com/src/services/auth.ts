import { AxiosError } from 'axios'
import api from './api'
import { User } from '@@/types/userType'
import { useAuthStore } from '@/store/userStore'

interface LoginSchema {
  email: string
  password: string
}

export const Auth = {
  loginUser: async (
    data: LoginSchema
  ): Promise<{ status: number; message: string; data?: any }> => {
    try {
      const response = await api.post('/login', {
        email: data.email,
        password: data.password
      })
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Login efetuado com sucesso',
          data: response.data as User
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao efetuar login',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data?.message || 'Erro ao efetuar login',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  },

  logout: () => {
    window.location.href = '/'
  },

  refreshToken: async (): Promise<{
    status: number
    message: string
    data?: any
  }> => {
    try {
      const { user } = useAuthStore.getState().state
      const response = await api.post('/auth/token/refresh', {
        refresh: user?.tokens.refreshToken
      })
      if (response.status === 200) {
        return {
          status: 200,
          message: 'Token atualizado com sucesso',
          data: response.data
        }
      } else {
        return {
          status: 500,
          message: 'Erro ao atualizar token',
          data: null
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data?.message || 'Erro ao atualizar token',
          data: null
        }
      } else {
        return {
          status: 500,
          message: 'Erro desconhecido',
          data: null
        }
      }
    }
  }
}
