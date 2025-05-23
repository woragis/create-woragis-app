export interface UserTokens {
  token: string
  refreshToken: string
}

export interface User {
  id: string
  email: string
  name: string
  status: string
  tokens: UserTokens
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
}
