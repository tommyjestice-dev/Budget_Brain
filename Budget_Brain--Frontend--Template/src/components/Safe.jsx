import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded border border-red-500/30 bg-red-900/20 text-red-200 text-sm">
          <div className="font-semibold mb-1">Chart failed to render.</div>
          <div className="opacity-80">{String(this.state.error)}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
