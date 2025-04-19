import { loadingStore } from './store'

export const setLoading = (loading: boolean) => {
  loadingStore.setState((state) => ({ ...state, loading }))
}
