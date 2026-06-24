import { useEffect, useState } from 'react'

export default function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const onNotify = (e) => {
      const id = Date.now() + Math.random()
      setToasts(t => [...t, { id, ...e.detail }])
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500)
    }
    window.addEventListener('eventhub:notify', onNotify)
    return () => window.removeEventListener('eventhub:notify', onNotify)
  }, [])

  if (!toasts.length) return null

  return (
    <div className="fixed right-4 top-4 z-50 space-y-2" role="status" aria-live="polite" aria-atomic="true">
      {toasts.map(t => (
        <div key={t.id} className={`p-3 rounded shadow-lg text-sm ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-white/5 text-white'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
