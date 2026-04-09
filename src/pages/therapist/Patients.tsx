import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types/database'
import { UserPlus, ChevronRight, Search } from 'lucide-react'

export default function TherapistPatients() {
  const { profile } = useAuth()
  const [patients, setPatients] = useState<Profile[]>([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState(false)

  useEffect(() => {
    if (!profile) return
    loadPatients()
  }, [profile])

  async function loadPatients() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('therapist_id', profile!.id)
      .eq('role', 'patient')
      .order('full_name')

    setPatients(data || [])
    setLoading(false)
  }

  async function assignPatient(e: React.FormEvent) {
    e.preventDefault()
    setAddError('')
    setAddSuccess(false)

    // Find patient by looking up auth users via profiles
    const { data: patientProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'patient')
      .is('therapist_id', null)

    // We need to match by checking the auth user email
    // For now, we find unassigned patients and match by name or ID
    // In production, use an Edge Function to look up by email

    if (!patientProfile || patientProfile.length === 0) {
      setAddError('No unassigned patients found. The patient must register first.')
      return
    }

    // Simple: assign the first unassigned patient (in production, match by email via edge function)
    const patient = patientProfile.find(p => p.full_name.toLowerCase().includes(newEmail.toLowerCase()))
    if (!patient) {
      setAddError('Patient not found. They must create an account first, then you can assign them by name.')
      return
    }

    await supabase
      .from('profiles')
      .update({ therapist_id: profile!.id })
      .eq('id', patient.id)

    setAddSuccess(true)
    setNewEmail('')
    setTimeout(() => {
      setShowAdd(false)
      setAddSuccess(false)
      loadPatients()
    }, 1500)
  }

  const filtered = patients.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="animate-pulse text-text-muted text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light text-text">Patients</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm hover:bg-accent/20 transition-colors"
        >
          <UserPlus size={16} />
          Assign Patient
        </button>
      </div>

      {/* Add patient modal */}
      {showAdd && (
        <div className="bg-surface border border-accent/30 rounded-xl p-5">
          <form onSubmit={assignPatient} className="space-y-3">
            <div className="text-text text-sm font-medium">Assign a patient by name</div>
            <p className="text-text-muted text-xs">The patient must have already registered. Search by their full name.</p>
            {addError && <div className="text-error text-xs">{addError}</div>}
            {addSuccess && <div className="text-success text-xs">Patient assigned successfully!</div>}
            <input
              type="text"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="Patient name..."
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-accent text-bg px-4 py-2 rounded-lg text-sm font-medium">
                Assign
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="text-text-muted px-4 py-2 text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {patients.length > 3 && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none"
          />
        </div>
      )}

      {/* Patient list */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
          {patients.length === 0 ? 'No patients assigned. Click "Assign Patient" to add one.' : 'No patients match your search.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => (
            <Link
              key={p.id}
              to={`/dashboard/patients/${p.id}`}
              className="flex items-center justify-between bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-colors"
            >
              <div>
                <div className="text-text text-sm font-medium">{p.full_name}</div>
                <div className="text-text-muted text-xs mt-0.5">Language: {p.language}</div>
              </div>
              <ChevronRight size={16} className="text-text-muted" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
