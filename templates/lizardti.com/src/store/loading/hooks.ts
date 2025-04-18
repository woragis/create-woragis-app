import { useStore } from '@tanstack/react-store'
import { loadingStore } from './store'

export const useLoading = useStore(loadingStore)
