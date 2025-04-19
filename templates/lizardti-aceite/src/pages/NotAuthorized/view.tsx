import { useNotAuthorized } from './model'
import { Container } from './style'

export const NotAuthorizedView = ({}: ReturnType<typeof useNotAuthorized>) => {
  return (
    <Container>
      <h1>Nao autorizado</h1>
      <h3>Faca login</h3>
    </Container>
  )
}
