import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";

/* ------------------------------------------------------------------ *
 *  Curated tool set for first-home buyers: the three calculators that
 *  matter most when you're working out what you can actually buy.
 * ------------------------------------------------------------------ */

interface Tool {
  no: string;
  title: string;
  hook: string;
  body: string;
  to: string;
}

const TOOLS: Tool[] = [
  {
    no: "01",
    title: "Instant Valuation",
    hook: "What's the property really worth?",
    body: "An indicative price range for any address, so you know if the asking price stacks up before you fall in love.",
    to: "/tools/valuation",
  },
  {
    no: "02",
    title: "Stamp Duty",
    hook: "Your VIC duty, to the dollar.",
    body: "Exact Victorian land transfer duty, including the first-home buyer exemption and concession, straight from the SRO.",
    to: "/tools/stamp-duty",
  },
  {
    no: "03",
    title: "Borrowing Capacity Calculator",
    hook: "Can you actually afford it?",
    body: "Your borrowing power, deposit position and every upfront cost in one view, so you walk away with an accurate number.",
    to: "/tools/pre-buying",
  },
];

export default function FirstHomeTools() {
  const ref = useReveal(0.1) as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section-pad"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="reveal mb-14 max-w-2xl">
          <p className="eyebrow mb-4">First-home buyers · Your tools</p>
          <h1 className="display mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--color-text)" }}>
            The three numbers<br />that decide everything.
          </h1>
          <p style={{ color: "var(--color-muted)", maxWidth: "52ch", lineHeight: 1.65 }}>
            Before you bid, get clear on what a place is worth, what the government will charge you, and
            what you can genuinely borrow. Free, broker-grade, and built for first-home buyers.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOOLS.map((t, i) => (
            <Link
              key={t.title}
              to={t.to}
              className="reveal group flex flex-col p-7 transition-all duration-300"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-line)",
                transitionDelay: `${i * 90}ms`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-line-gold)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-line)"; e.currentTarget.style.transform = "none"; }}
            >
              <span className="font-display font-semibold mb-6" style={{ color: "var(--color-gold)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                {t.no}
              </span>
              <h2 className="font-display font-semibold mb-2" style={{ color: "var(--color-text)", fontSize: "1.2rem", lineHeight: 1.25 }}>
                {t.title}
              </h2>
              <p className="mb-4 text-sm font-semibold" style={{ color: "var(--color-gold)" }}>{t.hook}</p>
              <p className="text-sm flex-1" style={{ color: "var(--color-muted)", lineHeight: 1.6 }}>{t.body}</p>
              <span className="inline-flex items-center gap-1.5 mt-6 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
                Open tool
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
                  className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                  <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* Back link to the journey */}
        <div className="reveal mt-12">
          <Link to="/first-home-buyers/steps" className="text-sm font-medium gold-underline pb-px" style={{ color: "var(--color-muted)" }}>
            ← Back to the 7-step journey
          </Link>
        </div>
      </div>
    </section>
  );
}
