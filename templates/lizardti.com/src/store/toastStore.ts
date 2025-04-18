import { toast } from 'react-toastify'
import { create } from 'zustand'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface ToastState {
  openToast: boolean
  typeToast: ToastType | null
  messageToast: string | null
}

interface ToastActions {
  setOpenToast: (typeToast: ToastType, message: string) => void
}

interface UseToastStore {
  state: ToastState
  dispatch: ToastActions
}

export const useToastStore = create<UseToastStore>((set) => {
  const showToast = (typeToast: ToastType, message: string) => {
    toast[typeToast](message, { position: 'bottom-right', autoClose: 3000 })
  }

  return {
    state: {
      openToast: false,
      typeToast: null,
      messageToast: null
    },
    dispatch: {
      setOpenToast: (typeToast: ToastType, message: string) => {
        set(() => ({
          state: { openToast: true, messageToast: message, typeToast }
        }))
        showToast(typeToast, message)
      }
    }
  }
})
