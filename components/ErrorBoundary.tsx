'use client'

import React, { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Generic React Error Boundary.
 * Catches JavaScript errors in child component tree and displays a fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Default error fallback UI with retry button.
 * Styled for dark mode with Tailwind.
 */
function DefaultErrorFallback({
  error,
  onReset,
}: {
  error: Error | null
  onReset: () => void
}) {
  return (
    <div role="alert" aria-live="assertive" className="flex flex-col items-center justify-center min-h-[200px] p-8 rounded-xl border border-red-500/20 bg-red-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-400">
          Algo deu errado
        </h3>
      </div>

      {error && process.env.NODE_ENV === 'development' && (
        <pre className="text-xs text-red-300/70 bg-red-500/5 rounded-lg p-3 mb-4 max-w-md overflow-auto border border-red-500/10">
          {error.message}
        </pre>
      )}

      <button
        onClick={onReset}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 hover:border-red-500/30"
      >
        Tentar novamente
      </button>
    </div>
  )
}

/**
 * Feature-level Error Boundary wrapper.
 * Use this around feature sections to prevent one feature from crashing the entire app.
 * 
 * @example
 * <FeatureErrorBoundary name="Pipeline">
 *   <PipelineView />
 * </FeatureErrorBoundary>
 */
export function FeatureErrorBoundary({
  children,
  name,
  onError,
}: {
  children: ReactNode
  name?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error(`[${name || 'Feature'}] Error:`, error)
        onError?.(error, errorInfo)
      }}
      fallback={
        <div role="alert" aria-live="polite" className="flex flex-col items-center justify-center min-h-[300px] p-8">
          <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center mb-4">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17l-5.384-3.19A1.002 1.002 0 015 11.14V6.838a1 1 0 01.5-.866l5.384-3.19a1 1 0 011 0l5.384 3.19a1 1 0 01.5.866v4.302a1 1 0 01-.5.866l-5.384 3.19a1 1 0 01-1 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            {name ? `${name} encontrou um problema` : 'Algo deu errado'}
          </h3>
          <p className="text-sm text-slate-500 mb-4 text-center max-w-sm">
            Esta seção encontrou um erro inesperado. As outras partes do app continuam funcionando normalmente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors border border-primary-500/20"
          >
            Recarregar página
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
