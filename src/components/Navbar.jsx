import { useState, useEffect, useContext, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AuthContext from '../context/AuthContext'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' }
  })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
      }
    } catch (err) { console.warn('theme apply error', err) }
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClass = `glass-navbar ${scrolled ? 'solid' : ''}`
  const navigate = useNavigate()
  const { user, profile, logout } = useContext(AuthContext)
  const role = profile?.role || user?.role || user?.user_metadata?.role || 'attendee'
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const roleLabel = role === 'organizer' ? 'ORGANIZER' : role === 'admin' ? 'ADMIN' : 'USER'
  const dashboardLink = user ? '/dashboard' : '/login'
  const [menuOpen, setMenuOpen] = useState(false)

  const badgeClass = useMemo(() => {
    if (role === 'organizer') return 'bg-purple-500 text-white'
    if (role === 'admin') return 'bg-red-500 text-white'
    return 'bg-green-500 text-white'
  }, [role])

  const avatarLabel = (profile?.full_name || user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold">EventHub</Link>
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          {!user && <><Link to="/about">About</Link><Link to="/contact">Contact</Link></>}

          {user && (role === 'attendee' || role === 'user' || role === 'USER') && (
            <>
              <Link to="/tickets">My Tickets</Link>
              <Link to={dashboardLink}>Dashboard</Link>
            </>
          )}

          {user && role === 'organizer' && (
            <>
              <Link to="/create-event">Create Event</Link>
              <Link to="/organizer">Organizer Dashboard</Link>
            </>
          )}

          {user && role === 'admin' && (
            <>
              <Link to="/admin">Admin Dashboard</Link>
              <Link to="/admin/users">Users</Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Toggle theme" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-2 py-1 rounded hover:bg-white/5">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            {!user && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="px-3 py-1 border rounded border-theme">Register</Link>
              </>
            )}

            {user && (
              <>
                <button aria-label="Notifications" className="px-2 py-1 rounded hover:bg-white/5">🔔</button>

                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded text-sm ${badgeClass}`}>{roleLabel}</div>

                  <div className="relative">
                    <button onClick={() => setMenuOpen(m => !m)} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-theme-weak flex items-center justify-center text-sm">{avatarLabel}</div>
                      )}
                      <span className="hidden sm:inline">{displayName}</span>
                    </button>

                    <AnimatePresence>
                      {menuOpen && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 bg-white/5 rounded shadow-lg w-48 z-20">
                          <div className="p-2">
                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-2 py-1">Profile</Link>
                            {role === 'user' && <Link to="/tickets" onClick={() => setMenuOpen(false)} className="block px-2 py-1">My Tickets</Link>}
                            {role === 'organizer' && <>
                              <Link to="/my-events" onClick={() => setMenuOpen(false)} className="block px-2 py-1">My Events</Link>
                              <Link to="/create-event" onClick={() => setMenuOpen(false)} className="block px-2 py-1">Create Event</Link>
                              <Link to="/organizer" onClick={() => setMenuOpen(false)} className="block px-2 py-1">Analytics</Link>
                            </>}
                            {role === 'admin' && <>
                              <Link to="/admin/settings" onClick={() => setMenuOpen(false)} className="block px-2 py-1">Settings</Link>
                            </>}
                            <button onClick={async () => { await handleLogout(); }} className="w-full text-left px-2 py-1">Logout</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </div>
          <button className="md:hidden px-3 py-2 border rounded border-theme" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            Menu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden px-4 pb-4 space-y-2 overflow-hidden">
            <Link to="/" className="block">Home</Link>
            <Link to="/events" className="block">Events</Link>
            <Link to={dashboardLink} className="block">Dashboard</Link>
            <Link to="/about" className="block">About</Link>
            <Link to="/contact" className="block">Contact</Link>
            {user ? (
              <>
                <Link to="/profile" className="block">Profile</Link>
                {user.role === 'admin' && <Link to="/admin" className="block">Admin</Link>}
                <button onClick={() => { logout(); setOpen(false) }} className="block text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">Login</Link>
                <Link to="/register" className="block">Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
