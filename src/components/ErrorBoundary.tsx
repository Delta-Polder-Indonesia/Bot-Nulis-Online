import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-2xl border border-red-200">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="font-bold text-gray-800 mb-1">
            Terjadi Kesalahan
          </h2>
          <p className="text-sm text-gray-500 mb-4 max-w-xs">
            {this.state.error?.message ?? "Kesalahan tidak diketahui"}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm
                       hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}