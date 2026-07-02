import { useReveal } from "../lib/useReveal";

/*
 * Trust / credibility strip, social proof and key differentiators.
 * Numbers and claims are illustrative until Akshay confirms real stats.
 */

const STATS = [
  { value: "100+",   label: "Clients guided",        note: "buyers, sellers & investors" },
  { value: "8 yrs",  label: "Melbourne market",      note: "deep suburb-level knowledge" },
  { value: "4",      label: "Service lines",         note: "sales · acreage · development · leasing" },
  { value: "1 call", label: "To a real expert",      note: "skip the call centre" },
];

// Real client reviews for Akshay Kapoor, supplied directly by him (2026-06-26).
// Condensed for the card layout — wording is faithful to the originals.
const TESTIMONIALS = [
  {
    quote: "As an interstate investor I expected a stressful sale, but Akshay made the whole process completely smooth. He personally arranged every renovation and tradie needed to get the property sale-ready — and it sold above his initial estimate. I feel genuinely lucky to have worked with him.",
    name: "Verified seller",
    detail: "Interstate investor",
  },
  {
    quote: "While the big-name agencies just put up a sign and run open homes, AK truly went above and beyond. He took the time to understand the local market and recommended smart, cost-effective improvements — painting, landscaping, tree pruning and lighting — all aimed at helping us reach our target sale price.",
    name: "Verified seller",
    detail: "Interstate vendor",
  },
  {
    quote: "An excellent experience with Akshay at Manifest. Knowledgeable, professional and incredibly helpful — his attention to detail and market insights made the process smooth and stress-free. I highly recommend him to anyone after a reliable, skilled agent.",
    name: "Verified seller",
    detail: "Manifest client",
  },
  {
    quote: "Akshay is a very thorough person who gives a lot of attention to the minute detail. He goes well beyond to get fantastic results, and the way he carried himself through a complex sale process is commendable.",
    name: "Verified seller",
    detail: "Vendor, complex sale",
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
        <div className="reveal mb-12 flex items-center gap-5">
          <img
            src={`${import.meta.env.BASE_URL}akshay-kapoor.jpg`}
            alt="Akshay Kapoor, Manifest Real Estate"
            className="w-16 h-16 rounded-full object-cover shrink-0"
            style={{ border: "2px solid var(--color-gold)" }}
            loading="lazy"
          />
          <div>
            <p className="eyebrow mb-1">What our clients say</p>
            <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
              Recent reviews for Akshay Kapoor
              <span style={{ color: "var(--color-gold)", marginLeft: "0.6rem", letterSpacing: "1px" }}>
                ★★★★★
              </span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-dim)" }}>
              Client reviews · supplied by Akshay Kapoor
            </p>
          </div>
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
                  <div
                    className="mb-2"
                    style={{ color: "var(--color-gold)", fontSize: "0.85rem", letterSpacing: "2px" }}
                    aria-label="5 out of 5 stars"
                  >
                    ★★★★★
                  </div>
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
