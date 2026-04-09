import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, BarChart3, Settings, Users, FolderOpen, LogOut, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'
import { t, setLang, getLang, type Lang } from '../lib/i18n'

function LangSwitcher() {
  const [, setTick] = useState(0)
  const current = getLang()
  const pick = (l: Lang) => { setLang(l); setTick(n => n + 1) }
  return (
    <div className="flex items-center gap-1">
      <Globe size={14} className="text-text-muted" />
      {(['en','ro','ru'] as Lang[]).map(l => (
        <button key={l} onClick={() => pick(l)} className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${current === l ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text'}`}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}

const patientNav = [
  { to: '/app', icon: Home, key: 'nav.sessions' as const },
  { to: '/app/progress', icon: BarChart3, key: 'nav.progress' as const },
  { to: '/app/settings', icon: Settings, key: 'nav.settings' as const },
]

const therapistNav = [
  { to: '/dashboard', icon: Home, key: 'nav.overview' as const },
  { to: '/dashboard/patients', icon: Users, key: 'nav.patients' as const },
  { to: '/dashboard/programs', icon: FolderOpen, key: 'nav.programs' as const },
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
          <span className="text-accent font-semibold text-lg tracking-wide">{t('app.name')}</span>
          <span className="text-text-muted text-sm hidden sm:block">{profile?.full_name}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ to, icon: Icon, key }) => (
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
                {t(key)}
              </NavLink>
            ))}
          </nav>
          <LangSwitcher />
          <button onClick={handleSignOut} className="text-text-muted hover:text-error transition-colors p-2" title={t('nav.signOut')}>
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
          {nav.map(({ to, icon: Icon, key }) => (
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
              {t(key)}
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
