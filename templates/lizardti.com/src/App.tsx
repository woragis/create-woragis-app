import { ToastContainer } from 'react-toastify'
import SimpleBackdrop from '@/components/backdrop'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/global.css'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/routes/route'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <SimpleBackdrop />
      <ToastContainer />
    </>
  )
}
