import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('ai_clock_settings');
      localStorage.removeItem('ai_clock_current_theme');
      localStorage.removeItem('ai_clock_alarms');
      localStorage.removeItem('ai_clock_world_cities');
      localStorage.removeItem('ai_clock_custom_wallpapers');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#030508] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-3xl bg-neutral-900 border border-white/10 text-center space-y-4">
            <h1 className="text-xl font-bold text-white">AI Digital Clock Pro</h1>
            <p className="text-sm text-slate-400">
              Something interrupted the clock display. Resetting cached preferences usually resolves this right away.
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors"
            >
              Reset & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
