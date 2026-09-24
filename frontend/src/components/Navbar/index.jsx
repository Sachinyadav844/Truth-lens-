import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Features', to: '/#features' },
  { label: 'Investigate', to: '/check' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const isLanding = location.pathname === '/'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
      <div className="page-shell">
        <nav className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3 text-[2rem] font-black leading-none text-ink-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-brand shadow-sm">
              <Search className="h-4 w-4" />
            </span>
            <span className="text-[2rem] font-black tracking-[-0.08em]">
              <span className="text-ink-900">Truth</span>
              <span className="text-brand">Lens</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive || (item.to === '/' && isLanding) ? 'text-brand' : 'text-ink-600'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-secondary">
                  Dashboard
                </Link>
                <Link to="/check" className="btn-primary">
                  Check a claim
                </Link>
                <Link to="/history" className="nav-link">
                  History
                </Link>
                <button type="button" onClick={logout} className="btn btn-secondary">
                  Sign out
                </button>
                <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-slate-200 bg-white py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn btn-secondary mt-2" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/check" className="btn-primary" onClick={() => setOpen(false)}>
                    Check a claim
                  </Link>
                  <Link to="/history" className="nav-link" onClick={() => setOpen(false)}>
                    History
                  </Link>
                  <button type="button" className="btn btn-secondary" onClick={() => { logout(); setOpen(false); }}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary mt-2" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

