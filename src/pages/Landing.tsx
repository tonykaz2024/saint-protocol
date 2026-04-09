import { Link } from 'react-router-dom'
import { Play, BarChart3, Shield, Users, ChevronRight, Headphones, Brain, Heart } from 'lucide-react'

const features = [
  {
    icon: Headphones,
    title: 'Guided Audio Sessions',
    desc: 'Professionally crafted therapeutic audio with research-backed male voices. Morning, visualization, and evening sessions tailored to each treatment phase.',
  },
  {
    icon: Brain,
    title: 'Evidence-Based Techniques',
    desc: 'ACT, MBSR, CBT, and polyvagal theory integrated into an 8-week progressive program. Cognitive defusion, body scanning, and self-compassion exercises.',
  },
  {
    icon: BarChart3,
    title: 'Mood Tracking & Analytics',
    desc: 'Patients report tension, rumination, and mood after each session. Therapists see real-time trends, phase comparisons, and progress over the full program.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    desc: 'HIPAA-aware architecture. Patient data is isolated with row-level security. No data sharing, no analytics tracking, no third-party access.',
  },
  {
    icon: Users,
    title: 'Therapist Dashboard',
    desc: 'Assign programs to patients, monitor adherence, view mood trajectories. Like prescribing medication u2014 but for behavioral consolidation.',
  },
  {
    icon: Heart,
    title: 'Works Offline',
    desc: 'Installs as a native app on any phone. Audio sessions are cached for offline playback. Mood data syncs when back online.',
  },
]

const phases = [
  { week: '1-2', name: 'Regulation', desc: 'Nervous system regulation through breathing and body scanning' },
  { week: '3-4', name: 'Restructuring', desc: 'Cognitive defusion, ACT metaphors, anti-spectatoring' },
  { week: '5-6', name: 'Consolidation', desc: 'Values-based living, self-compassion, identity separation' },
  { week: '7-8', name: 'Maintenance', desc: 'Integration, shorter sessions, gradual independence' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-accent font-semibold text-xl tracking-widest">SAINT</span>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-text-secondary hover:text-text text-sm transition-colors">Sign In</Link>
          <Link to="/register" className="bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-32 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-surface px-4 py-1.5 rounded-full text-xs text-text-secondary mb-8 border border-border">
          <Play size={12} className="text-accent" />
          Post-treatment therapeutic audio platform
        </div>
        <h1 className="text-4xl md:text-6xl font-light text-text leading-tight mb-6">
          Consolidate treatment gains<br />
          <span className="text-accent">with guided audio therapy</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          SAINT Protocol helps therapists prescribe structured audio programs for patients 
          after TMS, CBT, or other treatments. 8-week programs with mood tracking, 
          progress analytics, and offline mobile support.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="bg-accent text-bg px-8 py-3.5 rounded-xl font-medium hover:bg-accent-dim transition-colors flex items-center gap-2"
          >
            Start Free Trial
            <ChevronRight size={18} />
          </Link>
          <a href="#features" className="text-text-secondary hover:text-text px-6 py-3.5 transition-colors">
            Learn more
          </a>
        </div>
      </section>

      {/* Program phases */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-light text-center mb-12 text-text">Structured 8-Week Program</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {phases.map((p, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
              <div className="text-accent text-xs font-medium mb-2">WEEKS {p.week}</div>
              <div className="text-text font-medium mb-2">{p.name}</div>
              <div className="text-text-secondary text-sm leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-light text-center mb-12 text-text">Built for Clinical Use</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-colors">
              <f.icon size={24} className="text-accent mb-4" />
              <h3 className="text-text font-medium mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto bg-surface border border-border rounded-2xl p-10">
          <h2 className="text-2xl font-light text-text mb-4">Ready to prescribe audio therapy?</h2>
          <p className="text-text-secondary mb-8">Create your therapist account and assign your first patient program in minutes.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-accent text-bg px-8 py-3.5 rounded-xl font-medium hover:bg-accent-dim transition-colors"
          >
            Create Therapist Account
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border text-center text-text-muted text-sm">
        SAINT Protocol &copy; {new Date().getFullYear()} &mdash; Therapeutic audio for treatment consolidation
      </footer>
    </div>
  )
}
