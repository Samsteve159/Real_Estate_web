import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "var(--color-bg)", paddingTop: "9rem" }}
    >
      <p className="eyebrow mb-6">404</p>
      <h1
        className="display mb-5"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--color-text)" }}
      >
        Page not found.
      </h1>
      <p className="mb-10" style={{ color: "var(--color-muted)", maxWidth: "36ch" }}>
        The page you're looking for doesn't exist. It may have moved, or the URL may be incorrect.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors"
        style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--color-gold-bright)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--color-gold)")}
      >
        Back to home
      </Link>
    </div>
  );
}
