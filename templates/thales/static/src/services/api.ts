import axios from 'axios'
import Cookies from 'js-cookie'
import { Auth } from './auth'
import { AxiosRequestConfig } from 'axios'
import { useUser } from '../store/user/hooks'
import { logout, setUser } from '../store/user/actions'

const baseURL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL
})

const excludedRoutes = ['']

const isRouteExcluded = (url?: string) =>
  url ? excludedRoutes.some((route) => url.includes(route)) : false

const setAuthorizationHeader = (config: AxiosRequestConfig): void => {
  const userJSON = Cookies.get('user')

  if (userJSON && config.headers) {
    const { tokens } = JSON.parse(userJSON)
    if (tokens && tokens.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`
    }
  }
}

api.interceptors.request.use(
  (config) => {
    if (!isRouteExcluded(config.url)) {
      setAuthorizationHeader(config)
    }
    return config
  },
  (error) => {
    console.error('Request Interceptor Error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isRouteExcluded(originalRequest.url)
    ) {
      originalRequest._retry = true
      try {
        await refreshAccessToken()
        const { user } = useUser()
        if (user && user.tokens && user.tokens.access) {
          originalRequest.headers.Authorization = `Bearer ${user.tokens.access}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

const refreshAccessToken = async () => {
  try {
    const response = await Auth.refreshToken()
    if (response.status === 200) {
      const { user } = useUser()
      if (user) {
        setUser({
          ...user,
          tokens: {
            ...user.tokens,
            access: response.data.access
          }
        })
      }
    } else {
      throw new Error('Failed to refresh access token')
    }
    return response
  } catch (error) {
    logout()

    throw error
  }
}

export { logout }

export default api
