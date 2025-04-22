import { Store } from '@tanstack/react-store'

import type { ToastState } from './types'

const initialState: ToastState = {
  openToast: false,
  toastType: null,
  message: null
}

export const toastStore = new Store(initialState)
