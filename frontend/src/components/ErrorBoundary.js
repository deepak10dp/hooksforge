import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // In production, send to error tracking service like Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" data-testid="error-boundary">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-lg p-8 max-w-md w-full text-center">
            <div className="inline-flex p-4 bg-red-100 rounded-2xl border-2 border-red-200 mb-4">
              <AlertTriangle className="w-12 h-12 text-red-600" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Oops! Something went wrong</h1>
            <p className="text-slate-600 font-semibold mb-6">
              We're sorry, but something unexpected happened. Don't worry, your data is safe!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full font-bold text-lg rounded-2xl px-6 py-4 bg-slate-900 text-white border-2 border-slate-900 shadow-[0_4px_0_0_rgb(71,85,105)] hover:bg-slate-800 transition-all duration-150 active:translate-y-1 active:shadow-none"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;