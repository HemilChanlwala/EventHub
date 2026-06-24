import { createSlice } from '@reduxjs/toolkit'

const loadUser = () => {
  try { return JSON.parse(localStorage.getItem('eventhub_user') || 'null') } catch { return null }
}

const initialState = {
  current: loadUser()
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.current = action.payload
      try { localStorage.setItem('eventhub_user', JSON.stringify(action.payload)) } catch { void 0 }
    },
    logout(state) { state.current = null; try { localStorage.removeItem('eventhub_user') } catch { void 0 } },
    updateProfile(state, action) { state.current = { ...state.current, ...action.payload }; try { localStorage.setItem('eventhub_user', JSON.stringify(state.current)) } catch { void 0 } }
  }
})

export const { login, logout, updateProfile } = userSlice.actions
export default userSlice.reducer
