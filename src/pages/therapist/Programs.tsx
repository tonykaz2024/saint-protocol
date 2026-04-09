import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Program, ProgramPhase } from '../../types/database'
import { Plus, FolderOpen, Clock, ChevronDown, ChevronUp } from 'lucide-react'

const defaultPhases: ProgramPhase[] = [
  { name: 'Regulation', weeks: [1, 2], focus: 'Nervous system regulation: breathing, body scan, cyclic sighing', sessions_per_day: 3 },
  { name: 'Restructuring', weeks: [3, 4], focus: 'Cognitive restructuring: defusion exercises, ACT metaphors', sessions_per_day: 3 },
  { name: 'Consolidation', weeks: [5, 6], focus: 'Values-based living, self-compassion, identity separation', sessions_per_day: 2 },
  { name: 'Maintenance', weeks: [7, 8], focus: 'Integration, shorter sessions, gradual independence', sessions_per_day: 1 },
]

export default function TherapistPrograms() {
  const { profile } = useAuth()
  const [programs, setPrograms] = useState<Program[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [name, setName] = useState('8-Week Post-TMS Consolidation')
  const [description, setDescription] = useState('Structured therapeutic audio program with daily sessions, mood tracking, and progressive phase system.')
  const [weeks, setWeeks] = useState(8)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadPrograms()
  }, [profile])

  async function loadPrograms() {
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('therapist_id', profile!.id)
      .order('created_at', { ascending: false })

    setPrograms(data || [])
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    await supabase.from('programs').insert({
      therapist_id: profile!.id,
      name,
      description,
      duration_weeks: weeks,
      phases: defaultPhases,
    })

    setCreating(false)
    setShowCreate(false)
    loadPrograms()
  }

  if (loading) return <div className="animate-pulse text-text-muted text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light text-text">Programs</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm hover:bg-accent/20 transition-colors"
        >
          <Plus size={16} />
          New Program
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-surface border border-accent/30 rounded-xl p-5 space-y-4">
          <h3 className="text-text text-sm font-medium">Create New Program</h3>

          <div>
            <label className="text-text-secondary text-sm block mb-1.5">Program Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="text-text-secondary text-sm block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-text-secondary text-sm block mb-1.5">Duration (weeks)</label>
            <input
              type="number"
              value={weeks}
              onChange={e => setWeeks(Number(e.target.value))}
              min={1}
              max={24}
              className="w-32 bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="text-text-secondary text-sm block mb-2">Phases (default 4-phase structure)</label>
            <div className="space-y-2">
              {defaultPhases.map((p, i) => (
                <div key={i} className="bg-bg border border-border rounded-lg px-3 py-2 text-sm">
                  <span className="text-accent">Weeks {p.weeks[0]}-{p.weeks[1]}</span>
                  <span className="text-text ml-2">{p.name}</span>
                  <span className="text-text-muted ml-2">- {p.focus}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="bg-accent text-bg px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent-dim disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Program'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-text-muted px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Programs list */}
      {programs.length === 0 && !showCreate ? (
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <FolderOpen size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary mb-3">No programs created yet.</p>
          <button onClick={() => setShowCreate(true)} className="text-accent text-sm hover:underline">
            Create your first program
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {programs.map(p => (
            <div key={p.id} className="bg-surface border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
              >
                <div className="text-left">
                  <div className="text-text text-sm font-medium">{p.name}</div>
                  <div className="text-text-muted text-xs flex items-center gap-2 mt-0.5">
                    <Clock size={12} />
                    {p.duration_weeks} weeks &middot; {p.phases?.length || 0} phases
                  </div>
                </div>
                {expanded === p.id ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
              </button>

              {expanded === p.id && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <p className="text-text-secondary text-sm mb-3">{p.description}</p>
                  <div className="space-y-2">
                    {(p.phases || []).map((phase: ProgramPhase, i: number) => (
                      <div key={i} className="bg-bg border border-border rounded-lg px-3 py-2 text-sm">
                        <span className="text-accent">Weeks {phase.weeks[0]}-{phase.weeks[1]}</span>
                        <span className="text-text ml-2 font-medium">{phase.name}</span>
                        <div className="text-text-muted text-xs mt-0.5">{phase.focus} &middot; {phase.sessions_per_day} sessions/day</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
