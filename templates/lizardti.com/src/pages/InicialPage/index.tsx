import { useInicialPage } from './model'
import { InicialPageView } from './view'

export const InicialPage = () => {
  const modelInicialPage = useInicialPage()

  return <InicialPageView {...modelInicialPage} />
}
