import { useLogin } from './model'
import { LoginView } from './view'

export const Login = () => {
  const modelLogin = useLogin()

  return <LoginView {...modelLogin} />
}
