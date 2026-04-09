import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { MoodEntry } from '../../types/database'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingDown, TrendingUp, Activity } from 'lucide-react'

type Period = '7d' | '4w' | 'all'

export default function PatientProgress() {
  const { profile } = useAuth()
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [period, setPeriod] = useState<Period>('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadEntries()
  }, [profile])

  async function loadEntries() {
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('patient_id', profile!.id)
      .order('created_at', { ascending: true })

    setEntries(data || [])
    setLoading(false)
  }

  const filteredEntries = entries.filter(e => {
    if (period === 'all') return true
    const daysAgo = period === '7d' ? 7 : 28
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysAgo)
    return new Date(e.created_at) >= cutoff
  })

  const chartData = filteredEntries.map(e => ({
    day: `D${e.day_number}`,
    tension: e.tension,
    rumination: e.rumination,
    mood: e.mood,
  }))

  const avgOf = (key: 'tension' | 'rumination' | 'mood') => {
    if (filteredEntries.length === 0) return 0
    return (filteredEntries.reduce((sum, e) => sum + e[key], 0) / filteredEntries.length).toFixed(1)
  }

  const trend = (key: 'tension' | 'rumination' | 'mood') => {
    if (filteredEntries.length < 3) return 'stable'
    const first = filteredEntries.slice(0, 3).reduce((s, e) => s + e[key], 0) / 3
    const last = filteredEntries.slice(-3).reduce((s, e) => s + e[key], 0) / 3
    const diff = last - first
    if (Math.abs(diff) < 0.5) return 'stable'
    return diff > 0 ? 'up' : 'down'
  }

  if (loading) return <div className="animate-pulse text-text-muted text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light text-text">Progress</h1>
        <div className="flex gap-1 bg-surface rounded-lg p-1 border border-border">
          {(['7d', '4w', 'all'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '4w' ? '4 Weeks' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tension', value: avgOf('tension'), t: trend('tension'), good: 'down', icon: Activity, color: '#c97070' },
          { label: 'Rumination', value: avgOf('rumination'), t: trend('rumination'), good: 'down', icon: Activity, color: '#d4a853' },
          { label: 'Mood', value: avgOf('mood'), t: trend('mood'), good: 'up', icon: Activity, color: '#6db89a' },
        ].map(m => (
          <div key={m.label} className="bg-surface border border-border rounded-xl p-4">
            <div className="text-text-muted text-xs mb-1">{m.label}</div>
            <div className="flex items-end gap-2">
              <span className="text-text text-2xl font-light">{m.value}</span>
              {m.t !== 'stable' && (
                <span className={`text-xs flex items-center gap-0.5 ${
                  m.t === m.good ? 'text-success' : 'text-error'
                }`}>
                  {m.t === 'down' ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {m.t}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-text-secondary text-sm mb-4">Mood Trends</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" />
              <XAxis dataKey="day" stroke="#4a5568" fontSize={11} />
              <YAxis domain={[1, 10]} stroke="#4a5568" fontSize={11} />
              <Tooltip
                contentStyle={{ background: '#161922', border: '1px solid #2a2e3a', borderRadius: '8px' }}
                labelStyle={{ color: '#e8e0d5' }}
              />
              <Line type="monotone" dataKey="tension" stroke="#c97070" strokeWidth={2} dot={false} name="Tension" />
              <Line type="monotone" dataKey="rumination" stroke="#d4a853" strokeWidth={2} dot={false} name="Rumination" />
              <Line type="monotone" dataKey="mood" stroke="#6db89a" strokeWidth={2} dot={false} name="Mood" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
          Complete sessions to see your progress over time.
        </div>
      )}

      {/* Session count */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary text-sm">Total sessions completed</span>
          <span className="text-accent font-medium">{entries.length}</span>
        </div>
      </div>
    </div>
  )
}
