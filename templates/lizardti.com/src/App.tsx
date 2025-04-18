import { ToastContainer } from 'react-toastify'
import SimpleBackdrop from './components/backdrop'

import 'react-toastify/dist/ReactToastify.css'
import { AppRoutes } from './routes/route'
import './styles/global.css'

export default function App() {
  return (
    <>
      <AppRoutes />
      <SimpleBackdrop />
      <ToastContainer />
    </>
  )
}
