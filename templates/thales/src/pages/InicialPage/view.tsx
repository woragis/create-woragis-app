import * as Styled from './style'
import { useInicialPage } from './model'

export const InicialPageView = (props: ReturnType<typeof useInicialPage>) => {
  return (
    <Styled.Container>
      <h1>InicialPage</h1>
    </Styled.Container>
  )
}
