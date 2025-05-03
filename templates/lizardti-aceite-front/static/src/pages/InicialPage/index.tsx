import { useInicialPage } from './model'
import { InicialPageView } from './view'

export const InicialPage = () => {
  const model = useInicialPage()

  return <InicialPageView {...model} />
}
