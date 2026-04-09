import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, BarChart3, Settings, Users, FolderOpen, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const patientNav = [
  { to: '/app', icon: Home, label: 'Sessions' },
  { to: '/app/progress', icon: BarChart3, label: 'Progress' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

const therapistNav = [
  { to: '/dashboard', icon: Home, label: 'Overview' },
  { to: '/dashboard/patients', icon: Users, label: 'Patients' },
  { to: '/dashboard/programs', icon: FolderOpen, label: 'Programs' },
]

export default function Layout({ role }: { role: 'patient' | 'therapist' }) {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = role === 'patient' ? patientNav : therapistNav

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top bar */}
      <header className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-accent font-semibold text-lg tracking-wide">SAINT</span>
          <span className="text-text-muted text-sm hidden sm:block">{profile?.full_name}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/app' || to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-surface-hover text-accent' : 'text-text-secondary hover:text-text hover:bg-surface-hover'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <button onClick={handleSignOut} className="text-text-muted hover:text-error transition-colors p-2" title="Sign out">
            <LogOut size={18} />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-text-secondary p-2">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-surface border-b border-border px-4 py-2 flex flex-col gap-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app' || to === '/dashboard'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-surface-hover text-accent' : 'text-text-secondary hover:text-text'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
