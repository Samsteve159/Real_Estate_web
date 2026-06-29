import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import ToolsMenu from "./ToolsMenu";
import FirstHomeMenu from "./FirstHomeMenu";
import ConciergeWidget from "./ConciergeWidget";

/* ------------------------------------------------------------------ *
 *  Visible labels: Listings · First home buyers · Tools · About · Contact.
 *  TOOL_LINKS drives the mobile menu's expandable Tools group.
 * ------------------------------------------------------------------ */
const TOOL_LINKS = [
  { label: "Instant Valuation", to: "/tools/valuation" },
  { label: "Stamp Duty", to: "/tools/stamp-duty" },
  { label: "Borrowing Capacity Calculator", to: "/tools/pre-buying" },
  { label: "Portfolio", to: "/tools/portfolio" },
  { label: "Rental", to: "/tools/rental" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm font-medium transition-colors duration-200 gold-underline pb-px",
    isActive ? "text-[var(--color-gold)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
  ].join(" ");

/* ------------------------------------------------------------------ *
 *  Shell, transparent-over-hero sticky nav, floating concierge, footer
 * ------------------------------------------------------------------ */
export default function Shell() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      setMenuOpen(false);
      prevPath.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isHome = location.pathname === "/";
  const solid = scrolled || !isHome;

  const openConcierge = () => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("manifest:open-concierge"));
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--color-bg)" }}>

      {/* ---- Sticky Nav ---- */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: solid ? "rgba(10,10,11,0.96)" : "transparent",
          backdropFilter: solid ? "blur(16px)" : "none",
          borderBottom: solid ? "1px solid var(--color-line)" : "none",
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-32">

          {/* Logo: original full-colour Manifest badge (includes the wordmark) */}
          <Link to="/" className="flex items-center shrink-0" aria-label="Manifest Real Estate home">
            <img src={`${import.meta.env.BASE_URL}manifest-logo-color.png`} alt="Manifest Real Estate" className="w-auto" style={{ height: "116px" }} />
          </Link>

          {/* Desktop nav links, pushed to the right */}
          <ul className="hidden md:flex items-center gap-9 ml-auto">
            <li><NavLink to="/listings" className={linkClass}>Listings</NavLink></li>
            <li><FirstHomeMenu /></li>
            <li><ToolsMenu /></li>
            <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
            <li><NavLink to="/contact" className={linkClass}>Contact</NavLink></li>
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 flex flex-col gap-1.5 focus:outline-none"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="block h-px w-6 transition-all duration-300" style={{ background: "var(--color-text)", transform: menuOpen ? "rotate(45deg) translate(3.5px, 3.5px)" : "" }} />
            <span className="block h-px w-6 transition-all duration-300" style={{ background: "var(--color-text)", opacity: menuOpen ? 0 : 1, transform: menuOpen ? "scaleX(0)" : "" }} />
            <span className="block h-px w-6 transition-all duration-300" style={{ background: "var(--color-text)", transform: menuOpen ? "rotate(-45deg) translate(3.5px, -3.5px)" : "" }} />
          </button>
        </nav>

        {/* Mobile menu panel */}
        <div
          className="md:hidden transition-all duration-300 overflow-hidden"
          style={{
            maxHeight: menuOpen ? "640px" : "0px",
            background: "rgba(10,10,11,0.98)",
            backdropFilter: "blur(16px)",
            borderBottom: menuOpen ? "1px solid var(--color-line)" : "none",
          }}
        >
          <div className="px-6 py-6 flex flex-col gap-6">
            <NavLink to="/listings" className={linkClass}>Listings</NavLink>

            {/* First home buyers group */}
            <div>
              <p className="eyebrow mb-3">First home buyers</p>
              <div className="flex flex-col gap-3 pl-1">
                <NavLink to="/first-home-buyers/steps" className="text-sm" style={{ color: "var(--color-muted)" }}>Steps to follow</NavLink>
                <NavLink to="/tools/valuation" className="text-sm" style={{ color: "var(--color-muted)" }}>Instant Valuation</NavLink>
                <NavLink to="/tools/stamp-duty" className="text-sm" style={{ color: "var(--color-muted)" }}>Stamp Duty</NavLink>
                <NavLink to="/tools/pre-buying" className="text-sm" style={{ color: "var(--color-muted)" }}>Borrowing Capacity</NavLink>
              </div>
            </div>

            {/* Tools group */}
            <div>
              <p className="eyebrow mb-3">Tools</p>
              <div className="flex flex-col gap-3 pl-1">
                {TOOL_LINKS.map(({ label, to }) => (
                  <NavLink key={to} to={to} className="text-sm" style={{ color: "var(--color-muted)" }}>{label}</NavLink>
                ))}
                <button onClick={openConcierge} className="text-sm text-left" style={{ color: "var(--color-muted)" }}>
                  Buyer Concierge
                </button>
              </div>
            </div>

            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </div>
        </div>
      </header>

      {/* ---- Page content ---- */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ---- Footer ---- */}
      <footer className="border-t" style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <span className="font-display font-semibold text-lg" style={{ color: "var(--color-text)", letterSpacing: "-0.01em" }}>MANIFEST</span>
                <span className="ml-2 text-xs font-semibold uppercase" style={{ color: "var(--color-gold)", letterSpacing: "0.18em" }}>Real Estate</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--color-muted)" }}>
                Broker-grade tools and genuine guidance for Melbourne's first-home buyers and early investors. No jargon. No pressure.
              </p>
            </div>

            {/* Tools */}
            <div>
              <p className="eyebrow mb-5">Tools</p>
              <ul className="flex flex-col gap-3">
                {[
                  ["Instant Valuation", "/tools/valuation"],
                  ["Buyer Concierge", "/tools/concierge"],
                  ["Stamp Duty Calculator", "/tools/stamp-duty"],
                  ["Borrowing Capacity Calculator", "/tools/pre-buying"],
                  ["Portfolio Assessment", "/tools/portfolio"],
                  ["Rental Yield Tool", "/tools/rental"],
                ].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm transition-colors gold-underline" style={{ color: "var(--color-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="eyebrow mb-5">Company</p>
              <ul className="flex flex-col gap-3">
                {[["Listings", "/listings"], ["About", "/about"], ["Contact", "/contact"]].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm transition-colors gold-underline" style={{ color: "var(--color-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: "var(--color-line)" }}>
            <p className="text-xs" style={{ color: "var(--color-dim)" }}>
              © {new Date().getFullYear()} Manifest Real Estate. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "var(--color-dim)" }}>
              Valuations are indicative estimates only and do not constitute a formal appraisal.
            </p>
          </div>
        </div>
      </footer>

      {/* ---- Floating AI concierge (every page, follows scroll) ---- */}
      <ConciergeWidget />
    </div>
  );
}
