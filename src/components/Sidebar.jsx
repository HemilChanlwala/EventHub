import { Link } from 'react-router-dom'

const Sidebar = () => {
  const items = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/my-events', label: 'My Events' },
    { to: '/tickets', label: 'Tickets' },
    { to: '/notifications', label: 'Notifications' },
    { to: '/profile', label: 'Profile' },
    { to: '/settings', label: 'Settings' },
  ]

  return (
    <aside className="w-full lg:w-64 bg-surface border border-surface rounded-3xl p-4 min-h-[calc(100vh-80px)] shadow-sm">
      <nav className="space-y-1 text-slate-600">
        {items.map(i => (
          <Link
            key={i.to}
            to={i.to}
            className="block rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-surface-soft hover:text-slate-900 transition duration-300"
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
