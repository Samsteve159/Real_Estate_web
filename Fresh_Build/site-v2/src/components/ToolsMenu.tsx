import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ *
 *  Tools mega-menu, the 5 tools folded into 5 big animated buckets.
 *  Opens on hover or click under the "Tools" nav label. The concierge
 *  bucket opens the floating bot instead of navigating.
 * ------------------------------------------------------------------ */

interface Bucket {
  no: string;
  title: string;
  hook: string;       // strong, buyer-centric hook
  to?: string;        // route, or…
  action?: "concierge"; // …open the floating bot
}

const BUCKETS: Bucket[] = [
  { no: "01", title: "Instant Valuation", hook: "What's it really worth?", to: "/tools/valuation" },
  { no: "02", title: "Buyer Concierge", hook: "Ask anything, any time.", action: "concierge" },
  { no: "03", title: "Stamp Duty", hook: "Your VIC duty, to the dollar.", to: "/tools/stamp-duty" },
  { no: "04", title: "Borrowing Capacity", hook: "Can you actually afford it?", to: "/tools/pre-buying" },
  { no: "05", title: "Portfolio", hook: "See the equity you can use.", to: "/tools/portfolio" },
  { no: "06", title: "Rental", hook: "Will it pay for itself?", to: "/tools/rental" },
];

export default function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending close (e.g. when the pointer re-enters after
  // crossing the gap between the trigger and the fixed panel).
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
  // Delay the close so a brief exit across the dead strip under the
  // trigger doesn't slam the panel shut before the pointer reaches it.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 260);
  };
  const close = () => {
    cancelClose();
    setOpen(false);
  };

  const activate = (b: Bucket) => {
    close();
    if (b.action === "concierge") {
      window.dispatchEvent(new CustomEvent("manifest:open-concierge"));
    } else if (b.to) {
      navigate(b.to);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium transition-colors duration-200 gold-underline pb-px flex items-center gap-1.5"
        style={{ color: open ? "var(--color-gold)" : "var(--color-muted)" }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Tools
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Mega-panel */}
      {open && (
        <div
          className="fixed left-0 right-0 z-40"
          style={{ top: "8rem" }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {/* Transparent bridge spanning the full gap between the trigger and
              the panel (8rem-tall header), so the hover chain never breaks. */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BUCKETS.map((b, i) => (
                  <button
                    key={b.title}
                    onClick={() => activate(b)}
                    className="group text-left p-6 flex flex-col h-full"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      opacity: 0,
                      animation: `bucket-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards`,
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
                      {b.no}
                    </span>
                    <span className="font-display font-semibold mb-2" style={{ color: "var(--color-text)", fontSize: "1.05rem", lineHeight: 1.2 }}>
                      {b.title}
                    </span>
                    <span className="text-sm flex-1" style={{ color: "var(--color-muted)", lineHeight: 1.5 }}>
                      {b.hook}
                    </span>
                    <span className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
                      {b.action === "concierge" ? "Open chat" : "Open tool"}
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
                        className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                        <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes bucket-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
            @media (prefers-reduced-motion: reduce) { @keyframes bucket-in { from { opacity: 1; } to { opacity: 1; } } }
          `}</style>
        </div>
      )}
    </div>
  );
}
