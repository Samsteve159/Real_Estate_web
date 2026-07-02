import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ *
 *  Services mega-menu — the five service pages under one "Services"
 *  nav label. Opens on hover or click. Mirrors the hover-bridge
 *  behaviour used across the nav so the panel never slams shut when
 *  the pointer crosses the gap under the trigger.
 * ------------------------------------------------------------------ */

interface Service {
  no: string;
  title: string;
  hook: string;
  to: string;
}

const SERVICES: Service[] = [
  { no: "01", title: "Residential Sales", hook: "Tailored marketing and skilled negotiation to maximise your result.", to: "/services/residential-sales" },
  { no: "02", title: "Acreage & Lifestyle", hook: "Specialist advice for rural, hobby-farm and lifestyle property.", to: "/services/acreage-lifestyle" },
  { no: "03", title: "Development Projects", hook: "Unlock the value of sites and residential projects.", to: "/services/development-projects" },
  { no: "04", title: "Commercial Leasing", hook: "Connecting landlords and businesses with the right space.", to: "/services/commercial-leasing" },
  { no: "05", title: "Property Advisory", hook: "Strategic advice — plus free broker-grade tools.", to: "/services/property-advisory" },
];

export default function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMenu = () => { cancelClose(); setOpen(true); };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 260); };
  const close = () => { cancelClose(); setOpen(false); };

  const activate = (s: Service) => { close(); navigate(s.to); };

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium transition-colors duration-200 gold-underline pb-px flex items-center gap-1.5"
        style={{ color: open ? "var(--color-gold)" : "var(--color-muted)" }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Services
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Mega-panel */}
      {open && (
        <div className="fixed left-0 right-0 z-40" style={{ top: "8rem" }} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
          {/* Transparent hover bridge across the header gap */}
          <div className="absolute left-0 right-0" style={{ top: "-3.5rem", height: "3.5rem" }} aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-6">
            <div className="border p-3" style={{ background: "rgba(20,20,22,0.98)", backdropFilter: "blur(20px)", borderColor: "var(--color-line)", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.7)" }}>
              <p className="eyebrow px-3 pt-3 pb-4">How we help</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SERVICES.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => activate(s)}
                    className="group text-left p-6 flex flex-col h-full"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      opacity: 0,
                      animation: "svc-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
                      animationDelay: `${i * 60}ms`,
                      transition: "transform 0.3s ease, border-color 0.3s ease, background 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "var(--color-line-gold)";
                      e.currentTarget.style.background = "var(--color-surface)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.borderColor = "var(--color-line)";
                      e.currentTarget.style.background = "var(--color-bg)";
                    }}
                  >
                    <span className="font-display font-semibold mb-6" style={{ color: "var(--color-gold)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>{s.no}</span>
                    <span className="font-display font-semibold mb-2" style={{ color: "var(--color-text)", fontSize: "1.05rem", lineHeight: 1.2 }}>{s.title}</span>
                    <span className="text-sm flex-1" style={{ color: "var(--color-muted)", lineHeight: 1.5 }}>{s.hook}</span>
                    <span className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
                      Explore
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                        <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes svc-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
            @media (prefers-reduced-motion: reduce) { @keyframes svc-in { from { opacity: 1; } to { opacity: 1; } } }
          `}</style>
        </div>
      )}
    </div>
  );
}
