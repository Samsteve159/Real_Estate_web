import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-terra">404</p>
      <h1 className="display mt-4 text-6xl text-ink sm:text-7xl">
        This street isn't on the map.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you're after doesn't exist — but plenty of homes do.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="rounded-full bg-navy px-6 py-3 font-semibold text-paper transition-colors hover:bg-navy-soft"
        >
          Back to home
        </Link>
        <Link
          to="/valuation"
          className="rounded-full border hairline px-6 py-3 font-semibold text-ink transition-colors hover:border-teal hover:text-teal"
        >
          Value my home
        </Link>
      </div>
    </section>
  );
}
