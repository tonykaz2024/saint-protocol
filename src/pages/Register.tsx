import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AlertCircle } from 'lucide-react'
import { useLang } from '../contexts/LangContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'therapist' | 'patient'>('therapist')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, role, fullName)
      navigate('/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center mb-10">
          <span className="text-accent text-2xl font-semibold tracking-widest">{t('app.name')}</span>
        </Link>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-text text-lg font-medium text-center mb-2">{t('auth.create')}</h2>

          {error && (
            <div className="flex items-center gap-2 bg-error/10 text-error px-3 py-2 rounded-lg text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            {(['therapist', 'patient'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                  role === r
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-bg border-border text-text-secondary hover:text-text'
                }`}
              >
                {r === 'therapist' ? t('auth.therapist') : t('auth.patient')}
              </button>
            ))}
          </div>

          <div>
            <label className="text-text-secondary text-sm block mb-1.5">{t('auth.name')}</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-text-secondary text-sm block mb-1.5">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-text-secondary text-sm block mb-1.5">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-bg py-2.5 rounded-lg font-medium hover:bg-accent-dim transition-colors disabled:opacity-50"
          >
            {loading ? t('auth.creating') : t('auth.create')}
          </button>

          <p className="text-center text-text-muted text-sm">
            {t('auth.haveAccount')} <Link to="/login" className="text-accent hover:underline">{t('auth.signIn')}</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
