import { Store } from '@tanstack/react-store'
import { LoadingState } from './types'

const initialState: LoadingState = {
  loading: false
}

export const loadingStore = new Store(initialState)
