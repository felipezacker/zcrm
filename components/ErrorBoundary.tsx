import React, { ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{
            padding: '20px',
            margin: '10px',
            border: '1px solid red',
            borderRadius: '4px',
            backgroundColor: '#ffe0e0',
          }}>
            <h2>Something went wrong</h2>
            <p>An error has been reported. Please refresh the page.</p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '10px', fontSize: '12px' }}>
                <summary>Error details</summary>
                <pre style={{ overflow: 'auto' }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
