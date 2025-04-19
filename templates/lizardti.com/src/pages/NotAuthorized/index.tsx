import { useNotAuthorized } from './model'
import { NotAuthorizedView } from './view'

const NotAuthorized = () => {
  const model = useNotAuthorized()

  return <NotAuthorizedView {...model} />
}

export default NotAuthorized
