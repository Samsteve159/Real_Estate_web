import { useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ *
 *  "First home buyers" nav dropdown. Opens on hover/click beside the
 *  Listings label. Surfaces the guided journey plus the three tools
 *  that matter most to a first-home buyer. Carries the relocated hero
 *  eyebrow as its heading. Mirrors the Tools mega-menu hover bridge.
 * ------------------------------------------------------------------ */

interface Item {
  no: string;
  title: string;
  hook: string;
  to: string;
  cta: string;
}

const ITEMS: Item[] = [
  { no: "01", title: "Steps to follow", hook: "Your 7-step path, from finances to settlement.", to: "/first-home-buyers/steps", cta: "Start the journey" },
  { no: "02", title: "Instant Valuation", hook: "What's it really worth?", to: "/tools/valuation", cta: "Open tool" },
  { no: "03", title: "Stamp Duty", hook: "Your VIC duty, to the dollar.", to: "/tools/stamp-duty", cta: "Open tool" },
  { no: "04", title: "Borrowing Capacity", hook: "Can you actually afford it?", to: "/tools/pre-buying", cta: "Open tool" },
];

export default function FirstHomeMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMenu = () => {
    cancelClose();
    setOpen(true);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 260);
  };
  const close = () => {
    cancelClose();
    setOpen(false);
  };

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
        First home buyers
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed left-0 right-0 z-40"
          style={{ top: "8rem" }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {/* Hover bridge spanning the full gap between the trigger and the
              panel (header is 8rem tall, trigger sits mid-bar), so moving the
              pointer down never leaves the menu's hover subtree. */}
          <div className="absolute left-0 right-0" style={{ top: "-3.5rem", height: "3.5rem" }} aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="border p-3"
              style={{
                background: "rgba(20,20,22,0.98)",
                backdropFilter: "blur(20px)",
                borderColor: "var(--color-line)",
                boxShadow: "0 30px 70px -20px rgba(0,0,0,0.7)",
              }}
            >
              {/* Relocated hero eyebrow, now the menu heading */}
              <p className="eyebrow px-3 pt-3 pb-4">First-home buyers &amp; investors</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ITEMS.map((it, i) => (
                  <Link
                    key={it.title}
                    to={it.to}
                    onClick={close}
                    className="group text-left p-6 flex flex-col h-full"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      opacity: 0,
                      animation: "fhb-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
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
                    <span className="font-display font-semibold mb-6" style={{ color: "var(--color-gold)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                      {it.no}
                    </span>
                    <span className="font-display font-semibold mb-2" style={{ color: "var(--color-text)", fontSize: "1.05rem", lineHeight: 1.2 }}>
                      {it.title}
                    </span>
                    <span className="text-sm flex-1" style={{ color: "var(--color-muted)", lineHeight: 1.5 }}>
                      {it.hook}
                    </span>
                    <span className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
                      {it.cta}
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
                        className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                        <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Self-contained entrance keyframes, so the cards always fade in
              regardless of whether the Tools menu has been opened. */}
          <style>{`
            @keyframes fhb-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
            @media (prefers-reduced-motion: reduce) { @keyframes fhb-in { from { opacity: 1; } to { opacity: 1; } } }
          `}</style>
        </div>
      )}
    </div>
  );
}
