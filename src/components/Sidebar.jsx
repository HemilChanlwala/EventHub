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
    <aside className="w-full lg:w-64 glass p-4 min-h-[calc(100vh-80px)]">
      <nav className="space-y-1 text-white/90">
        {items.map(i => (
          <Link key={i.to} to={i.to} className="block py-2 px-3 rounded hover:bg-white/10">{i.label}</Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
