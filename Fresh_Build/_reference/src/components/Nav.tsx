import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b hairline bg-bone/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/manifest-logo.png"
            alt="Manifest Real Estate"
            className="h-11 w-11 rounded-full object-cover"
          />
          <span className="flex flex-col leading-none">
            <span className="display text-xl tracking-tight text-navy">Manifest</span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-teal">
              Real Estate
            </span>
          </span>
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
            className="rounded-full bg-teal px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-teal-bright"
          >
            <span className="sm:hidden">My home's worth</span>
            <span className="hidden sm:inline">What's my home worth?</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
