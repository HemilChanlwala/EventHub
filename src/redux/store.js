// Configures the Redux store for shared event and user state.
import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './slices/eventsSlice'
import userReducer from './slices/userSlice'

export default configureStore({
  reducer: {
    events: eventsReducer,
    user: userReducer
  }
})
