import { useStore } from '@tanstack/react-store'
import { toastStore } from './store'

export const useToast = () => useStore(toastStore)
