import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StatusPanel } from './StatusPanel';

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

/**
 * Keeps a render error or a failed lazy chunk (flaky venue Wi-Fi, or a chunk removed by a redeploy)
 * from blanking the whole app. A reload fetches the current index.html and its chunks.
 * Keyed on the route by its parent, so navigating away clears the error.
 */
export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Pulse could not render this page.', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <StatusPanel title="Something went wrong" tone="error">
        <p className="status-panel__body">This page could not be shown. Reloading usually fixes it.</p>
        <button type="button" className="button button--primary" onClick={() => window.location.reload()}>
          Reload
        </button>
      </StatusPanel>
    );
  }
}
