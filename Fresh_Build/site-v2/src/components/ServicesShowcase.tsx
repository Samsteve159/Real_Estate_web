import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";

/* ------------------------------------------------------------------ *
 *  "Our Expertise" — the four headline services on the home page.
 *  Evergreen copy (Akshay's brief): expertise and value, never live
 *  market conditions.
 * ------------------------------------------------------------------ */

interface Card {
  eyebrow: string;
  title: string;
  description: string;
  to: string;
  isSignature?: boolean;
}

const CARDS: Card[] = [
  {
    eyebrow: "Homeowners",
    title: "Residential Sales",
    description: "Helping homeowners achieve exceptional results through tailored marketing, strategic negotiation and personalised service.",
    to: "/services/residential-sales",
    isSignature: true,
  },
  {
    eyebrow: "Rural & lifestyle",
    title: "Acreage & Lifestyle",
    description: "Specialising in rural and lifestyle properties, connecting buyers and sellers with unique opportunities.",
    to: "/services/acreage-lifestyle",
  },
  {
    eyebrow: "Developers & landowners",
    title: "Development Projects",
    description: "Working alongside developers and landowners to market development opportunities, from boutique projects to larger residential and commercial sites.",
    to: "/services/development-projects",
  },
  {
    eyebrow: "Landlords & business",
    title: "Commercial Leasing",
    description: "Connecting landlords and businesses with commercial spaces that support long-term growth.",
    to: "/services/commercial-leasing",
  },
];

export default function ServicesShowcase() {
  const ref = useReveal(0.1) as React.RefObject<HTMLElement>;

  return (
    <section ref={ref as React.RefObject<HTMLDivElement>} className="section-pad" style={{ background: "var(--color-bg)" }} id="expertise">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="reveal mb-16 max-w-2xl">
          <p className="eyebrow mb-4">Our expertise</p>
          <h2 className="display mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--color-text)" }}>
            Advice and results at every<br />
            <span style={{ color: "var(--color-muted)" }}>stage of the property journey.</span>
          </h2>
          <p style={{ color: "var(--color-muted)", lineHeight: 1.65, maxWidth: "52ch" }}>
            Whether you're selling a family home, purchasing lifestyle acreage, marketing a development site or securing commercial premises, our team provides tailored advice and practical solutions.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--color-line)" }}>
          {CARDS.map((card, i) => (
            <article
              key={card.to}
              className="reveal card-lift group flex flex-col p-8 lg:p-10"
              style={{
                background: card.isSignature ? "var(--color-surface-2)" : "var(--color-surface)",
                transitionDelay: `${i * 80}ms`,
                borderLeft: card.isSignature ? "2px solid var(--color-gold)" : "none",
              }}
            >
              <p className="eyebrow mb-5" style={{ opacity: 0.8 }}>{card.eyebrow}</p>
              <h3 className="display mb-4" style={{ color: "var(--color-text)", fontSize: "1.35rem" }}>{card.title}</h3>
              <p className="text-sm leading-relaxed flex-1 mb-8" style={{ color: "var(--color-muted)" }}>{card.description}</p>
              <Link
                to={card.to}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                style={{ color: card.isSignature ? "var(--color-gold)" : "var(--color-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = card.isSignature ? "var(--color-gold)" : "var(--color-muted)")}
              >
                Learn more
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                  <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
