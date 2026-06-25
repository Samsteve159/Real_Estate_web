import { useReveal } from "../lib/useReveal";

/*
 * Trust / credibility strip, social proof and key differentiators.
 * Numbers and claims are illustrative until Akshay confirms real stats.
 */

const STATS = [
  { value: "100+",   label: "Clients guided",        note: "first-home buyers & investors" },
  { value: "8 yrs",  label: "Melbourne market",      note: "deep suburb-level knowledge" },
  { value: "Free",   label: "Broker-grade tools",    note: "no sign-up, no hidden agenda" },
  { value: "1 call", label: "To a real expert",      note: "skip the call centre" },
];

const TESTIMONIALS = [
  {
    quote: "I walked into my first auction knowing exactly what to bid. The valuation tool gave me the confidence to go up to my number, and I got the property.",
    name: "Sarah M.",
    detail: "First-home buyer, Brighton",
  },
  {
    quote: "Akshay was the only agent who actually showed me the numbers behind his advice. The stamp duty calculator alone saved me a nasty surprise at settlement.",
    name: "James & Priya T.",
    detail: "Investors, South Yarra",
  },
];

export default function TrustBand() {
  const ref = useReveal(0.1) as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section-pad"
      style={{ background: "var(--color-bg)" }}
      id="trust"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Stats row */}
        <div
          className="reveal border-y mb-20 py-14 grid grid-cols-2 md:grid-cols-4 gap-10"
          style={{ borderColor: "var(--color-line)" }}
        >
          {STATS.map(({ value, label, note }) => (
            <div key={label} className="flex flex-col gap-1">
              <p
                className="display"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--color-gold)" }}
              >
                {value}
              </p>
              <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                {label}
              </p>
              <p className="text-xs" style={{ color: "var(--color-dim)" }}>
                {note}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="reveal mb-6">
          <p className="eyebrow mb-12">What our clients say</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className="reveal p-8 border"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-line)",
                borderTop: "2px solid var(--color-gold)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Open quote mark */}
              <div
                className="mb-6 font-display font-bold select-none"
                style={{ fontSize: "3rem", lineHeight: 1, color: "var(--color-gold)", opacity: 0.4 }}
                aria-hidden="true"
              >
                "
              </div>
              <blockquote>
                <p
                  className="text-base leading-relaxed mb-8"
                  style={{ color: "var(--color-muted)" }}
                >
                  {t.quote}
                </p>
                <figcaption>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                    {t.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-dim)" }}>
                    {t.detail}
                  </p>
                </figcaption>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
