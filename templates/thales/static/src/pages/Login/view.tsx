import * as Styled from './style'
import { useLogin } from './model'

export const LoginView = (props: ReturnType<typeof useLogin>) => {
  return (
    <Styled.Container>
      <h1>Login</h1>
    </Styled.Container>
  )
}
