import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";

/* ------------------------------------------------------------------ *
 *  First-home-buyer journey: a celebratory intro + 7 animated steps,
 *  finances through to settlement, on a glowing gold timeline.
 * ------------------------------------------------------------------ */

interface Step {
  no: string;
  title: string;
  a: string; // first line
  b: string; // second line (after the arrow)
}

const STEPS: Step[] = [
  { no: "01", title: "Sort your finances", a: "Map your savings, income and spending, then tidy up your credit.", b: "Know exactly what you're working with before you start." },
  { no: "02", title: "Know your borrowing power", a: "Talk to a lender or broker on our panel and secure a pre-approval.", b: "It sets your real budget and makes your offers credible to secure a property." },
  { no: "03", title: "Budget the full out-of-pocket cost", a: "Add your deposit, stamp duty, LMI and the upfront fees.", b: "Plan to your final amount, not just the sold sticker price. The sold price isn't the final price; these costs add up to what you actually pay for the home." },
  { no: "04", title: "Search & shortlist", a: "Lock your must-haves and target suburbs, then start inspecting.", b: "Compare every option against your must-haves and narrow down your final selection." },
  { no: "05", title: "Do your due diligence", a: "Order building & pest checks; get the contract and Section 32 reviewed by your conveyancer or solicitor.", b: "Buy with your eyes open, with no nasty surprises later." },
  { no: "06", title: "Make your move", a: "Privately negotiate, or bid at auction, with a firm walk-away number in mind.", b: "Sign only once the terms genuinely work for you." },
  { no: "07", title: "Settlement", a: "Forward the signed contract to your broker or bank, wait for the contract to become unconditional, then transfer the deposit amount, organise the final inspection before settlement and collect your keys on settlement day.", b: "The home is officially yours." },
];

export default function FirstHomeSteps() {
  const ref = useReveal(0.05) as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section-pad relative overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Ambient gold glow, top-centre */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "520px",
          background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(194,162,103,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6">
        {/* ===== Congratulations intro ===== */}
        <div className="reveal text-center mb-20">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 text-xs font-semibold uppercase"
            style={{
              border: "1px solid var(--color-line-gold)",
              color: "var(--color-gold)",
              letterSpacing: "0.18em",
              borderRadius: "999px",
            }}
          >
            <span className="shimmer-dot" /> Your first-home journey
          </span>

          <h1
            className="display mb-6 mx-auto"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "var(--color-text)", maxWidth: "20ch" }}
          >
            Congratulations on
            <br />
            <span className="gold-shimmer">Manifesting</span> your first home.
          </h1>

          <p className="mx-auto" style={{ color: "var(--color-muted)", maxWidth: "52ch", lineHeight: 1.7, fontSize: "1.05rem" }}>
            Deciding to buy your first home is one of life's biggest and most exciting milestones.
            Take a breath, and let us walk you through exactly how it unfolds, step by step, the Manifest way.
          </p>
        </div>

        {/* ===== Timeline ===== */}
        <ol className="relative">
          {/* The glowing vertical line */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 line-draw"
            style={{
              left: "27px",
              width: "2px",
              background: "linear-gradient(to bottom, var(--color-gold) 0%, var(--color-gold-dim) 60%, transparent 100%)",
            }}
          />

          {STEPS.map((s, i) => (
            <li
              key={s.no}
              className="reveal relative pl-20 pb-12 last:pb-0"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              {/* Number node */}
              <span
                className="absolute left-0 top-0 flex items-center justify-center font-display font-semibold node-pulse"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-line-gold)",
                  color: "var(--color-gold)",
                  fontSize: "1rem",
                  boxShadow: "0 0 0 6px var(--color-bg), 0 8px 24px -8px rgba(194,162,103,0.4)",
                }}
              >
                {s.no}
              </span>

              <div
                className="p-6 sm:p-7 transition-all duration-300"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-line-gold)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-line)"; e.currentTarget.style.transform = "none"; }}
              >
                <h2 className="font-display font-semibold mb-3" style={{ color: "var(--color-text)", fontSize: "1.35rem" }}>
                  {s.title}
                </h2>
                <p style={{ color: "var(--color-muted)", lineHeight: 1.6 }}>{s.a}</p>
                <p className="flex items-start gap-2 mt-2" style={{ lineHeight: 1.6 }}>
                  <span style={{ color: "var(--color-gold)", fontWeight: 700 }} aria-hidden="true">→</span>
                  <span style={{ color: "var(--color-text)" }}>{s.b}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* ===== Closing CTA ===== */}
        <div className="reveal text-center mt-20">
          <p className="mb-5 mx-auto font-display font-semibold" style={{ color: "var(--color-text)", fontSize: "clamp(1.3rem, 3vw, 1.9rem)", maxWidth: "20ch", lineHeight: 1.25 }}>
            Stop guessing what you can afford.<br />
            <span className="gold-shimmer cta-pop">Click below and find it out for free.</span>
          </p>

          {/* Bouncing chevron, reinforces "click below" */}
          <svg className="cta-bounce mx-auto mb-6" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 9l7 7 7-7" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/first-home-buyers/tools"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold transition-colors duration-200"
              style={{ background: "var(--color-gold)", color: "var(--color-bg)", letterSpacing: "0.06em" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold-bright)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
            >
              Access Your Free Tools
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-medium border transition-colors duration-200"
              style={{ border: "1px solid var(--color-line)", color: "var(--color-muted)", letterSpacing: "0.04em" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; e.currentTarget.style.borderColor = "var(--color-line)"; }}
            >
              Talk to a Manifest representative
            </Link>
          </div>
        </div>
      </div>

      {/* Page-scoped animation */}
      <style>{`
        .gold-shimmer {
          background: linear-gradient(100deg, var(--color-gold) 20%, var(--color-gold-bright) 45%, #fff 50%, var(--color-gold-bright) 55%, var(--color-gold) 80%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: gold-sweep 4s linear infinite;
        }
        @keyframes gold-sweep { to { background-position: -200% center; } }
        .shimmer-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-gold); animation: dot-pulse 1.8s ease-in-out infinite; }
        @keyframes dot-pulse { 0%,100% { opacity: 0.35; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.15); } }
        .line-draw { transform-origin: top; animation: line-grow 1.1s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes line-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .node-pulse { animation: node-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes node-in { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .cta-pop { display: inline-block; animation: cta-pop 2.6s ease-in-out infinite; }
        @keyframes cta-pop { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        .cta-bounce { animation: cta-bounce 1.6s ease-in-out infinite; }
        @keyframes cta-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(7px); } }
        @media (prefers-reduced-motion: reduce) {
          .gold-shimmer { animation: none; }
          .shimmer-dot, .line-draw, .node-pulse, .cta-pop, .cta-bounce { animation: none; }
        }
      `}</style>
    </section>
  );
}
