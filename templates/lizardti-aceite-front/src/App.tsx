import { ToastContainer } from 'react-toastify'
import SimpleBackdrop from '@/components/backdrop'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/global.css'
import { AppRoutes } from './routes/route'

export default function App() {
  return (
    <>
      <SimpleBackdrop />
      <ToastContainer />
      <AppRoutes />
    </>
  )
}
