import { useState, useEffect, useContext } from 'react'
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
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const roleLabel = role === 'organizer' ? 'Organizer' : role === 'admin' ? 'Admin' : 'User'
  const dashboardLink = user ? '/dashboard' : '/login'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold">EventHub</Link>
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Home</Link>
          <Link to="/events" className="transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Events</Link>
          <Link to={dashboardLink} className="transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Dashboard</Link>
          <Link to="/about" className="transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">About</Link>
          <Link to="/contact" className="transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Contact</Link>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Toggle theme" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-2 py-1 rounded hover:bg-white/5">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2">
                  <span>Hi, {displayName}</span>
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-theme-weak">{roleLabel}</span>
                </Link>
                {role === 'organizer' && <Link to="/organizer">Organizer</Link>}
                {role === 'admin' && <Link to="/admin">Admin</Link>}
                <button onClick={handleLogout} className="px-3 py-1 border rounded border-theme">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Login</Link>
                <Link to="/register" className="px-3 py-1 border rounded border-theme transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow">Register</Link>
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
            <Link to="/" className="block transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Home</Link>
            <Link to="/events" className="block transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Events</Link>
            <Link to={dashboardLink} className="block transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Dashboard</Link>
            <Link to="/about" className="block transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">About</Link>
            <Link to="/contact" className="block transition duration-200 hover:text-white hover:bg-white/10 hover:shadow-glow rounded-md px-2 py-1">Contact</Link>
            {user ? (
              <>
                <div className="block px-2 py-1 text-theme-weak">Signed in as {displayName} • {roleLabel}</div>
                <Link to="/profile" className="block">Profile</Link>
                {role === 'organizer' && <Link to="/organizer" className="block">Organizer</Link>}
                {role === 'admin' && <Link to="/admin" className="block">Admin</Link>}
                <button onClick={() => { handleLogout(); setOpen(false) }} className="block text-left">Logout</button>
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
