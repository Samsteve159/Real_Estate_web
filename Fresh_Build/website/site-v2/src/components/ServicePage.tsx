import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";

/* ------------------------------------------------------------------ *
 *  ServicePage — shared, evergreen layout for the five Service pages
 *  (Residential Sales, Acreage & Lifestyle, Development Projects,
 *  Commercial Leasing, Property Advisory). Copy is written to stay
 *  relevant for years: expertise, process and value — never "we
 *  currently have…" or live market conditions.
 *
 *  hero → intro paragraphs → a labelled list of services/areas →
 *  optional children slot (e.g. the buyer tools on Property Advisory) →
 *  a closing CTA.
 * ------------------------------------------------------------------ */

export interface ServicePageProps {
  eyebrow: string;
  title: React.ReactNode;
  intro: string[];
  listLabel: string;
  items: string[];
  children?: React.ReactNode;
  ctaTitle?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export default function ServicePage({
  eyebrow,
  title,
  intro,
  listLabel,
  items,
  children,
  ctaTitle = "Let's start the conversation",
  ctaLabel = "Get in touch",
  ctaTo = "/contact",
}: ServicePageProps) {
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={{ background: "var(--color-bg)", paddingTop: "9rem" }}>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="reveal max-w-3xl">
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="display mb-7" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "var(--color-text)", lineHeight: 1.08 }}>
            {title}
          </h1>
          <div className="flex flex-col gap-4" style={{ color: "var(--color-muted)", maxWidth: "58ch", lineHeight: 1.7, fontSize: "1.08rem" }}>
            {intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Services / areas list */}
      <section className="border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="reveal eyebrow mb-10">{listLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--color-line)" }}>
            {items.map((item, i) => (
              <div key={item} className="reveal p-7 flex items-start gap-4" style={{ background: "var(--color-bg)", transitionDelay: `${i * 40}ms` }}>
                <span className="font-display font-semibold shrink-0" style={{ color: "var(--color-gold)", fontSize: "0.8rem", letterSpacing: "0.1em", paddingTop: "0.15rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display font-medium" style={{ color: "var(--color-text)", fontSize: "1.02rem", lineHeight: 1.35 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional extra content */}
      {children}

      {/* CTA */}
      <section className="border-t" style={{ borderColor: "var(--color-line)" }}>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="reveal eyebrow mb-5">Next step</p>
          <h2 className="reveal display mb-8 mx-auto" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "var(--color-text)", maxWidth: "22ch" }}>
            {ctaTitle}
          </h2>
          <div className="reveal flex flex-wrap gap-4 justify-center">
            <Link to={ctaTo} className="px-7 py-3.5 text-sm font-semibold" style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}>
              {ctaLabel}
            </Link>
            <Link to="/listings" className="px-7 py-3.5 text-sm font-semibold border" style={{ borderColor: "var(--color-line-gold)", color: "var(--color-text)" }}>
              View listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
