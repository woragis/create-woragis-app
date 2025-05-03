import { AppDispatch } from '../store'
import { userActions } from './slice'

// example of thunk-based actions
export const loginUser =
  (id: string, name: string, email: string, password: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(userActions.setLoading(true))

    try {
      // simulate API delay
      await new Promise((res) => setTimeout(res, 1000))
      dispatch(userActions.setUser({ id, name, email, password }))
    } finally {
      dispatch(userActions.setLoading(false))
    }
  }

export const logoutUser = () => (dispatch: AppDispatch) => {
  dispatch(userActions.logout())
}
