import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center mb-10">
          <span className="text-accent text-2xl font-semibold tracking-widest">SAINT</span>
        </Link>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-text text-lg font-medium text-center mb-2">Welcome back</h2>

          {error && (
            <div className="flex items-center gap-2 bg-error/10 text-error px-3 py-2 rounded-lg text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="text-text-secondary text-sm block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-text-secondary text-sm block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-bg py-2.5 rounded-lg font-medium hover:bg-accent-dim transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-text-muted text-sm">
            No account? <Link to="/register" className="text-accent hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
