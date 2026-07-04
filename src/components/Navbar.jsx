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
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to={dashboardLink}>Dashboard</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Toggle theme" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-2 py-1 rounded hover:bg-white/5">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile">Hi, {displayName}</Link>
                {role === 'organizer' && <Link to="/organizer">Organizer</Link>}
                {role === 'admin' && <Link to="/admin">Admin</Link>}
                <button onClick={handleLogout} className="px-3 py-1 border rounded border-theme">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="px-3 py-1 border rounded border-theme">Register</Link>
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
