import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/** Catches render-time errors so a single broken view can't blank the whole site. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[ui] render error", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow text-terra">Something slipped</p>
        <h1 className="display mt-4 text-5xl text-ink">A small bump in the road</h1>
        <p className="mt-3 max-w-md text-muted">
          That view hit an unexpected error. Reloading usually clears it.
        </p>
        <button
          onClick={() => window.location.assign("/")}
          className="mt-8 rounded-full bg-navy px-6 py-3 font-semibold text-paper transition-colors hover:bg-navy-soft"
        >
          Back to home
        </button>
      </div>
    );
  }
}
