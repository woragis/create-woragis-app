import { create } from 'zustand'

interface LoadingState {
  startLoading: boolean
}

interface LoadingActions {
  setLoading: (value: boolean) => void
}

interface UseLoadingStore {
  state: LoadingState
  dispatch: LoadingActions
}

export const useLoadingStore = create<UseLoadingStore>((set) => ({
  state: {
    startLoading: false
  },
  dispatch: {
    setLoading: (value: boolean) => {
      set(() => ({
        state: { startLoading: value }
      }))
    }
  }
}))
