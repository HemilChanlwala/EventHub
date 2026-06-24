import { createSlice } from '@reduxjs/toolkit'
import { getEvents } from '../../services'

const initialState = {
  items: getEvents()
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action) { state.items = action.payload || [] },
    addEvent(state, action) { state.items.unshift(action.payload) },
    updateEvent(state, action) {
      const idx = state.items.findIndex(e => String(e.id) === String(action.payload.id))
      if (idx >= 0) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteEvent(state, action) { state.items = state.items.filter(e => String(e.id) !== String(action.payload)) }
  }
})

export const { setEvents, addEvent, updateEvent, deleteEvent } = eventsSlice.actions
export default eventsSlice.reducer
