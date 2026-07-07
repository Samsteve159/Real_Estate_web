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

// Reviews grouped per director. Akshay's are real, supplied by him (2026-06-26).
// Rishi's are PLACEHOLDERS — swap for real, verified client quotes before launch.
interface Review { quote: string; name: string; detail: string; }
interface DirectorReviews { name: string; photo: string; alt: string; reviews: Review[]; }

const DIRECTORS: DirectorReviews[] = [
  {
    name: "Rishi Vohra",
    photo: "rishi-vohra.jpg",
    alt: "Rishi Vohra, Manifest Real Estate",
    // Real client reviews for Rishi (supplied by Akshay, 2026-07-02).
    reviews: [
      {
        quote: "Rishi was a really outstanding agent. It's not only that he helped me achieve over my target price for the sale of my property. He is very professional with deep knowledge of the market. He'll help you with due diligence and market assessment, and suggest changes that help achieve a high sales target. Very responsive and reliable. I highly recommend him.",
        name: "Verified seller",
        detail: "Property vendor",
      },
      {
        quote: "Rishi really knows what he is doing. Really competent. I am really happy to be doing business with him.",
        name: "Verified client",
        detail: "Manifest client",
      },
    ],
  },
  {
    name: "Akshay Kapoor",
    photo: "akshay-kapoor.jpg",
    alt: "Akshay Kapoor, Manifest Real Estate",
    reviews: [
      {
        quote: "As an interstate investor I expected a stressful sale, but Akshay made the whole process completely smooth. He personally arranged every renovation and tradie needed to get the property sale-ready, and it sold above his initial estimate.",
        name: "Verified seller",
        detail: "Interstate investor",
      },
      {
        quote: "While the big-name agencies just put up a sign and run open homes, AK truly went above and beyond. He took the time to understand the local market and recommended smart, cost-effective improvements, all aimed at helping us reach our target sale price.",
        name: "Verified seller",
        detail: "Interstate vendor",
      },
    ],
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

        {/* Testimonials — one block per director, two reviews each */}
        <div className="reveal mb-14 max-w-2xl">
          <p className="eyebrow mb-4">What our clients say</p>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "var(--color-text)" }}>
            Trusted by the people we work for.
          </h2>
        </div>

        <div className="flex flex-col gap-16">
          {DIRECTORS.map((d) => (
            <div key={d.name}>
              {/* Director header */}
              <div className="reveal mb-8 flex items-center gap-5">
                <img
                  src={`${import.meta.env.BASE_URL}${d.photo}`}
                  alt={d.alt}
                  className="w-16 h-16 rounded-full object-cover shrink-0"
                  style={{ border: "2px solid var(--color-gold)" }}
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                    Recent reviews for {d.name}
                    <span style={{ color: "var(--color-gold)", marginLeft: "0.6rem", letterSpacing: "1px" }}>
                      ★★★★★
                    </span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-dim)" }}>
                    Director · Manifest Real Estate
                  </p>
                </div>
              </div>

              {/* Two review cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {d.reviews.map((t, i) => (
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
                    <div
                      className="mb-6 font-display font-bold select-none"
                      style={{ fontSize: "3rem", lineHeight: 1, color: "var(--color-gold)", opacity: 0.4 }}
                      aria-hidden="true"
                    >
                      "
                    </div>
                    <blockquote>
                      <p className="text-base leading-relaxed mb-8" style={{ color: "var(--color-muted)" }}>
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
          ))}
        </div>
      </div>
    </section>
  );
}
