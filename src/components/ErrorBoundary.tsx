import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-4xl mb-4 opacity-30">&#x26A0;</div>
            <h2 className="text-xl text-text mb-2">Something went wrong</h2>
            <p className="text-text-secondary text-sm mb-4">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent text-bg px-6 py-2 rounded-lg text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
