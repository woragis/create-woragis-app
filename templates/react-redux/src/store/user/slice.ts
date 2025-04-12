import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from './types'

interface UserState {
  user: User | null
  loading: boolean
}

const initialState: UserState = {
  user: null,
  loading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState['user']>) {
      state.user = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    logout(state) {
      state.user = null
      state.loading = false
    },
  },
})

export const userActions = userSlice.actions
export default userSlice
