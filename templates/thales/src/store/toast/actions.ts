import { toast } from 'react-toastify'

import type { ToastType } from './types'
import { toastStore } from './store'

export const showToast = (toastType: ToastType, message: string) => {
  toastStore.setState((state) => {
    toast[toastType](message, { position: 'bottom-right', autoClose: 3000 })
    return {
      ...state,
      toastType,
      message,
      openToast: true
    }
  })
}
