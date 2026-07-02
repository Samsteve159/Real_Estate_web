import { Link } from "react-router-dom";

interface PageStubProps {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
}

/**
 * Placeholder page shell, used for routes that are stubs (not yet built).
 * Replace with the real page component once the tool/section is built.
 */
export default function PageStub({ eyebrow, title, description, status = "In development" }: PageStubProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)", paddingTop: "9rem" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24 flex-1">
        <div className="max-w-2xl">
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h1
            className="display mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--color-text)" }}
          >
            {title}
          </h1>
          <p className="mb-10" style={{ color: "var(--color-muted)", lineHeight: 1.65, fontSize: "1.05rem" }}>
            {description}
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest mb-12"
            style={{
              background: "rgba(194,162,103,0.1)",
              color: "var(--color-gold)",
              border: "1px solid var(--color-line-gold)",
              letterSpacing: "0.18em",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "var(--color-gold)", animation: "pulse 2s ease infinite" }}
              aria-hidden="true"
            />
            {status}
          </div>
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium gold-underline pb-px"
              style={{ color: "var(--color-muted)" }}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes pulse { from {} to {} }
        }
      `}</style>
    </div>
  );
}
