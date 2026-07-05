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
    const idx = existing.findIndex(
      (u) =>
        (u.id && user.id && u.id === user.id) ||
        (u.email && user.email && u.email === user.email)
    )

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
    return getUsers().find(
      (u) => (u.email || '').toLowerCase() === String(email).toLowerCase()
    ) || null
  } catch (err) {
    console.warn('findUserByEmail', err)
    return null
  }
}

export const deleteUser = (idOrEmail) => {
  try {
    const users = getUsers()
    const filtered = users.filter(
      (u) => !(u.id === idOrEmail || u.email === idOrEmail)
    )
    localStorage.setItem('eventhub_users', JSON.stringify(filtered))
    return true
  } catch (err) {
    console.warn('deleteUser', err)
    return false
  }
}
