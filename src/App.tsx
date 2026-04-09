import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LangProvider } from './contexts/LangContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientHome from './pages/patient/Home'
import PatientPlayer from './pages/patient/Player'
import PatientProgress from './pages/patient/Progress'
import PatientSettings from './pages/patient/Settings'
import TherapistDashboard from './pages/therapist/Dashboard'
import TherapistPatients from './pages/therapist/Patients'
import TherapistPatientDetail from './pages/therapist/PatientDetail'
import TherapistPrograms from './pages/therapist/Programs'
import Layout from './components/Layout'
import type { ReactNode } from 'react'

function ProtectedRoute({ children, role }: { children: ReactNode; role?: string }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="animate-pulse text-accent text-xl">SAINT</div></div>
  if (!user) return <Navigate to="/login" />
  if (role && !profile) return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="animate-pulse text-accent text-xl">SAINT</div></div>
  if (role && profile && profile.role !== role) return <Navigate to={profile.role === 'therapist' ? '/dashboard' : '/app'} />
  return <>{children}</>
}

function AppRoutes() {
  const { user, profile } = useAuth()

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={profile?.role === 'therapist' ? '/dashboard' : '/app'} /> : <Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/app" element={<ProtectedRoute role="patient"><Layout role="patient" /></ProtectedRoute>}>
        <Route index element={<PatientHome />} />
        <Route path="player/:trackId" element={<PatientPlayer />} />
        <Route path="progress" element={<PatientProgress />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedRoute role="therapist"><Layout role="therapist" /></ProtectedRoute>}>
        <Route index element={<TherapistDashboard />} />
        <Route path="patients" element={<TherapistPatients />} />
        <Route path="patients/:patientId" element={<TherapistPatientDetail />} />
        <Route path="programs" element={<TherapistPrograms />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LangProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  )
}
