import { useLogin } from './model'
import { LoginView } from './view'

export const Login = () => {
  const model = useLogin()

  return <LoginView {...model} />
}
