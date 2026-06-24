import sampleEvents from '../data/sampleEvents'

export const getEvents = () => {
  try {
    const local = JSON.parse(localStorage.getItem('eventhub_events') || '[]')
    // show local (created) events first
    return [...local, ...sampleEvents]
  } catch {
    return sampleEvents
  }
}

export const saveEvent = (ev) => {
  try {
    const existing = JSON.parse(localStorage.getItem('eventhub_events') || '[]')
    existing.unshift(ev)
    localStorage.setItem('eventhub_events', JSON.stringify(existing))
    return ev
  } catch (err) {
    console.warn('saveEvent', err)
    return ev
  }
}

export const api = {
  getEvents,
  saveEvent
}

export default api

// --- User helpers (localStorage-backed mock) ---
export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('eventhub_users') || '[]')
  } catch (err) {
    console.warn('getUsers', err)
    return []
  }
}

export const saveUser = (user) => {
  try {
    const existing = getUsers()
    const idx = existing.findIndex(u => (u.id && user.id && u.id === user.id) || (u.email && user.email && u.email === user.email))
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...user }
    } else {
      existing.unshift(user)
    }
    localStorage.setItem('eventhub_users', JSON.stringify(existing))
    return user
  } catch (err) {
    console.warn('saveUser', err)
    return user
  }
}

export const findUserByEmail = (email) => {
  if (!email) return null
  try {
    return getUsers().find(u => (u.email || '').toLowerCase() === String(email).toLowerCase()) || null
  } catch (err) {
    console.warn('findUserByEmail', err)
    return null
  }
}

export const deleteUser = (idOrEmail) => {
  try {
    const users = getUsers()
    const filtered = users.filter(u => !(u.id === idOrEmail || u.email === idOrEmail))
    localStorage.setItem('eventhub_users', JSON.stringify(filtered))
    return true
  } catch (err) {
    console.warn('deleteUser', err)
    return false
  }
}

export const deleteEvent = (id) => {
  try {
    const events = JSON.parse(localStorage.getItem('eventhub_events') || '[]')
    const filtered = events.filter(e => String(e.id) !== String(id))
    localStorage.setItem('eventhub_events', JSON.stringify(filtered))
    return true
  } catch (err) {
    console.warn('deleteEvent', err)
    return false
  }
}
