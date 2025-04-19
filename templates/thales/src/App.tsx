import { ToastContainer } from 'react-toastify'
import SimpleBackdrop from './components/backdrop'

import 'react-toastify/dist/ReactToastify.css'
import { AppRoutes } from './routes/route'
import { styles } from './styles/global'
import { Global } from '@emotion/react'

export default function App() {
  return (
    <>
      <AppRoutes />
      <SimpleBackdrop />
      <ToastContainer />
      <Global styles={styles} />
    </>
  )
}
