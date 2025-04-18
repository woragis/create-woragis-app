import { ToastContainer } from 'react-toastify'
import SimpleBackdrop from './components/backdrop'

import 'react-toastify/dist/ReactToastify.css'
import { AppRoutes } from './routes/route'
import { GlobalStyle } from './styles/global'


export default function App() {
  return (
    <>
      <AppRoutes />
      <SimpleBackdrop />
      <ToastContainer />
      <GlobalStyle />
    </>
  )
}
