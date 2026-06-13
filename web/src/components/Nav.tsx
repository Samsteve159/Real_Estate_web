import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b hairline bg-bone/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-baseline gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-navy text-paper">
            <span className="display text-xl leading-none">M</span>
          </span>
          <span className="display text-2xl tracking-tight text-ink">Manifest</span>
          <span className="eyebrow hidden text-muted sm:inline">Real Estate</span>
        </Link>

        <nav className="flex items-center gap-7 text-sm">
          <Link
            to="/"
            className={`link-underline hidden pb-0.5 sm:inline ${
              pathname === "/" ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Home
          </Link>
          <a href="/#listings" className="link-underline hidden pb-0.5 text-muted hover:text-ink sm:inline">
            Listings
          </a>
          <Link
            to="/valuation"
            className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-teal-bright"
          >
            What's my home worth?
          </Link>
        </nav>
      </div>
    </header>
  );
}
