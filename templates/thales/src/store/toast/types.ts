export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastState {
  openToast: boolean
  toastType: ToastType | null
  message: string | null
}
