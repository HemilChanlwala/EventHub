import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Bell, Menu, Moon, Sun, UserRound, X } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const navLinks = [
  { label: 'Home', to: '/', exact: true },
  { label: 'Events', to: '/events' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const containerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.07,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const logoVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const actionsVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut', delay: 0.12 } },
}

const getMotionProps = (reducedMotion) => {
  if (reducedMotion) return {}
  return {
    whileHover: { y: -2, scale: 1.03 },
    whileTap: { scale: 0.97 },
  }
}

const getIsActive = (pathname, link) => {
  if (link.exact) return pathname === link.to
  return pathname === link.to || pathname.startsWith(`${link.to}/`)
}

const NavItem = ({ link, pathname, onClick }) => {
  const reducedMotion = useReducedMotion()
  const isActive = getIsActive(pathname, link)

  return (
    <motion.div variants={itemVariants} {...getMotionProps(reducedMotion)}>
      <Link
        to={link.to}
        onClick={onClick}
        className={`navbar-link group relative inline-flex cursor-pointer items-center px-1 py-2 text-sm transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F172A] ${
          isActive ? 'font-semibold text-[#4338CA]' : 'font-medium text-slate-600 hover:text-[#4338CA]'
        }`}
      >
        {link.label}
        <span
          className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-[#818CF8] transition-all duration-300 ease-in-out ${
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        />
      </Link>
    </motion.div>
  )
}

const MobileNavItem = ({ link, pathname, onClick }) => {
  const isActive = getIsActive(pathname, link)

  return (
    <Link
      to={link.to}
      onClick={onClick}
      className={`navbar-mobile-link flex h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] ${
        isActive
          ? 'bg-indigo-50 text-[#4338CA] ring-1 ring-indigo-200'
          : 'text-slate-600 hover:bg-slate-50 hover:text-[#4338CA]'
      }`}
    >
      {link.label}
    </Link>
  )
}

const AuthButton = ({ to, children, variant = 'primary', onClick }) => {
  const reducedMotion = useReducedMotion()
  const baseClass = 'navbar-auth inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-4 focus-visible:ring-offset-white'
  const variantClass = variant === 'secondary'
    ? 'border border-indigo-200 bg-white text-[#4338CA] hover:-translate-y-0.5 hover:scale-[1.03] hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-[0_12px_28px_rgba(79,70,229,0.14)] active:scale-[0.97]'
    : 'bg-[#4F46E5] text-white hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[#4338CA] hover:shadow-[0_14px_34px_rgba(79,70,229,0.30)] active:scale-[0.97]'

  return (
    <motion.div variants={actionsVariants} {...getMotionProps(reducedMotion)}>
      <Link to={to} onClick={onClick} className={`${baseClass} ${variantClass}`}>
        {children}
      </Link>
    </motion.div>
  )
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'light' } catch { return 'light' }
  })
  const location = useLocation()
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const { user, profile, logout } = useContext(AuthContext)
  const role = profile?.role || user?.role || user?.user_metadata?.role || 'attendee'
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const userInitial = displayName.trim().charAt(0).toUpperCase() || 'U'
  const dashboardLink = user ? '/dashboard' : '/login'

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visibleLinks = useMemo(() => navLinks, [])

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate('/login')
  }

  const closeMenu = () => setOpen(false)

  return (
    <motion.nav
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={containerVariants}
      className={`site-navbar fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ease-in-out ${
        scrolled
          ? 'border-slate-200/80 bg-white/88 shadow-[0_18px_44px_rgba(30,41,59,0.10),0_8px_26px_rgba(79,70,229,0.08)] backdrop-blur-xl'
          : 'border-slate-200 bg-white/96 shadow-[0_10px_26px_rgba(30,41,59,0.06)]'
      }`}
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <motion.div variants={logoVariants} {...getMotionProps(reducedMotion)}>
          <Link
            to="/"
            className="navbar-brand inline-flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 transition-all duration-300 ease-in-out hover:text-[#4338CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-bold text-white shadow-[0_10px_24px_rgba(79,70,229,0.36)]">
              EH
            </span>
            EventHub
          </Link>
        </motion.div>

        <div className="hidden items-center gap-8 md:flex">
          {visibleLinks.map((link) => (
            <NavItem key={link.to} link={link} pathname={location.pathname} />
          ))}
          {user && (
            <NavItem link={{ label: 'Dashboard', to: dashboardLink }} pathname={location.pathname} />
          )}
          <Link to={dashboardLink} className="sr-only">Dashboard</Link>
        </div>

        <motion.div variants={actionsVariants} className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <motion.button
                type="button"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
                className="navbar-control inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4338CA] hover:shadow-[0_12px_28px_rgba(79,70,229,0.14)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                {...getMotionProps(reducedMotion)}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              <AuthButton to="/login" variant="secondary">Login</AuthButton>
              <AuthButton to="/register">Sign Up</AuthButton>
            </>
          ) : (
            <>
              <Link
                aria-label="Notifications"
                to="/notifications"
                className="navbar-control inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4338CA] hover:shadow-[0_12px_28px_rgba(79,70,229,0.14)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
              >
                <Bell size={18} />
              </Link>
              <motion.button
                type="button"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
                className="navbar-control inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4338CA] hover:shadow-[0_12px_28px_rgba(79,70,229,0.14)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                {...getMotionProps(reducedMotion)}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              <div
                className="navbar-user flex max-w-48 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                title={`Hi, ${displayName}`}
              >
                <span className="truncate">Hi, {displayName}</span>
              </div>
              <motion.button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-indigo-200 bg-white px-4 text-sm font-semibold text-[#4338CA] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-indigo-50 hover:shadow-[0_12px_28px_rgba(79,70,229,0.14)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                {...getMotionProps(reducedMotion)}
              >
                Logout
              </motion.button>
            </>
          )}
        </motion.div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="navbar-control inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4338CA] hover:shadow-[0_12px_28px_rgba(79,70,229,0.14)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-4 focus-visible:ring-offset-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reducedMotion ? { display: 'none' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className="navbar-mobile-panel overflow-hidden border-t border-slate-200 bg-white/98 shadow-[0_22px_48px_rgba(30,41,59,0.12)] backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-h-[calc(100svh-4rem)] max-w-7xl flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6">
              {user && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-bold text-white shadow-[0_10px_24px_rgba(79,70,229,0.28)]">
                    {userInitial}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">Hi, {displayName}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium capitalize text-slate-500">
                      <UserRound size={13} />
                      {role}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-1">
                {visibleLinks.map((link) => (
                  <MobileNavItem key={link.to} link={link} pathname={location.pathname} onClick={closeMenu} />
                ))}
              </div>
              <Link to={dashboardLink} onClick={closeMenu} className="sr-only">Dashboard</Link>

              <div className="grid gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-300 ease-in-out hover:bg-indigo-50 hover:text-[#4338CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                {!user ? (
                  <>
                    <AuthButton to="/login" variant="secondary" onClick={closeMenu}>Login</AuthButton>
                    <AuthButton to="/register" onClick={closeMenu}>Sign Up</AuthButton>
                  </>
                ) : (
                  <>
                    <Link
                      aria-label="Notifications"
                      to="/notifications"
                      onClick={closeMenu}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-300 ease-in-out hover:bg-indigo-50 hover:text-[#4338CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <Bell size={18} />
                      Notifications
                    </Link>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={dashboardLink}
                        onClick={closeMenu}
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#4F46E5] px-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-[#4338CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                      >
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-indigo-200 bg-white px-3 text-sm font-semibold text-[#4338CA] transition-all duration-300 ease-in-out hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
