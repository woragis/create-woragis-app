import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '../store/userStore'
import { AxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL
})

const excludedRoutes = ['/auth']

const isRouteExcluded = (url?: string) =>
  url ? excludedRoutes.some((route) => url.includes(route)) : false

const setAuthorizationHeader = (config: AxiosRequestConfig): void => {
  const userJSON = Cookies.get('user')

  if (userJSON && config.headers) {
    const { tokens } = JSON.parse(userJSON)
    if (tokens && tokens.token) {
      config.headers.Authorization = `${tokens.token}`
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
      //Ou 403
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry &&
      !isRouteExcluded(originalRequest.url)
    ) {
      originalRequest._retry = true
      try {
        await refreshAccessToken()

        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

const refreshAccessToken = async () => {
  logout()
}

export const logout = () => {
  const { logOut } = useAuthStore.getState().dispatch
  logOut()
}

export default api
