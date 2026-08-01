// Broadcasts a browser event that the shared Toaster component turns into a notification.
export function notify(message, type = 'info') {
  try {
    const ev = new CustomEvent('eventhub:notify', { detail: { message, type } })
    window.dispatchEvent(ev)
  } catch (err) { void err }
}

export default notify
