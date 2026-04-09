import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Users, Activity, TrendingDown, FolderOpen, ChevronRight } from 'lucide-react'

interface PatientSummary {
  id: string
  full_name: string
  latest_mood: { tension: number; rumination: number; mood: number } | null
  sessions_completed: number
  program_status: string
}

export default function TherapistDashboard() {
  const { profile } = useAuth()
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [stats, setStats] = useState({ totalPatients: 0, activePrograms: 0, sessionsToday: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadDashboard()
  }, [profile])

  async function loadDashboard() {
    const { data: myPatients } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('therapist_id', profile!.id)
      .eq('role', 'patient')

    if (!myPatients) {
      setLoading(false)
      return
    }

    const summaries: PatientSummary[] = []
    for (const p of myPatients) {
      const { data: pp } = await supabase
        .from('patient_programs')
        .select('status')
        .eq('patient_id', p.id)
        .single()

      const { data: moods, count } = await supabase
        .from('mood_entries')
        .select('tension, rumination, mood', { count: 'exact' })
        .eq('patient_id', p.id)
        .order('created_at', { ascending: false })
        .limit(1)

      summaries.push({
        id: p.id,
        full_name: p.full_name,
        latest_mood: moods?.[0] || null,
        sessions_completed: count || 0,
        program_status: pp?.status || 'none',
      })
    }

    setPatients(summaries)
    setStats({
      totalPatients: myPatients.length,
      activePrograms: summaries.filter(s => s.program_status === 'active').length,
      sessionsToday: 0, // Could be enhanced with today's count
    })
    setLoading(false)
  }

  if (loading) return <div className="animate-pulse text-text-muted text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-light text-text">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Patients', value: stats.totalPatients, icon: Users },
          { label: 'Active Programs', value: stats.activePrograms, icon: Activity },
          { label: 'Programs', value: stats.totalPatients, icon: FolderOpen },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border rounded-xl p-4">
            <s.icon size={16} className="text-accent mb-2" />
            <div className="text-text text-2xl font-light">{s.value}</div>
            <div className="text-text-muted text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Patient list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-text text-sm font-medium">Patients</h2>
          <Link to="/dashboard/patients" className="text-accent text-sm hover:underline">View all</Link>
        </div>

        {patients.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-text-secondary mb-3">No patients assigned yet.</p>
            <Link to="/dashboard/patients" className="text-accent text-sm hover:underline">Add your first patient</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {patients.slice(0, 5).map(p => (
              <Link
                key={p.id}
                to={`/dashboard/patients/${p.id}`}
                className="flex items-center justify-between bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-colors"
              >
                <div>
                  <div className="text-text text-sm font-medium">{p.full_name}</div>
                  <div className="text-text-muted text-xs mt-0.5">
                    {p.sessions_completed} sessions &middot;
                    <span className={`ml-1 ${
                      p.program_status === 'active' ? 'text-success' : 
                      p.program_status === 'completed' ? 'text-accent' : 'text-text-muted'
                    }`}>
                      {p.program_status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.latest_mood && (
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <TrendingDown size={12} className="text-success" />
                      T:{p.latest_mood.tension} R:{p.latest_mood.rumination} M:{p.latest_mood.mood}
                    </div>
                  )}
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
