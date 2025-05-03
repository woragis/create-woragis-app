export interface Tokens {
  access: string
  access_expires: string
  refresh: string
  refresh_expires: string
}

export interface User {
  birth_date: string | null
  company: string[]
  email: string
  first_name: string
  group: number
  id: string
  last_login_at: string
  last_name: string
  picture: string | null
  sex: string | null
  tokens: Tokens
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
}
