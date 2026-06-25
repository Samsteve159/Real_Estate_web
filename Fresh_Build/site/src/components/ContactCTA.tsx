import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";

/*
 * Contact CTA band, a full-width warm invitation.
 * The navy gradient here is the one deliberate use of --color-navy
 * (subtle, in the background, not competing with gold).
 */

export default function ContactCTA() {
  const ref = useReveal(0.1) as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative overflow-hidden"
      style={{ background: "var(--color-surface-2)" }}
      id="contact-cta"
    >
      {/* Navy depth accent, the one place navy earns its spot */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 120% at 80% 50%, rgba(0,57,112,0.18) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">

        <div className="reveal max-w-lg">
          <p className="eyebrow mb-4">Talk to Akshay</p>
          <h2
            className="display mb-5"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "var(--color-text)" }}
          >
            Get a real answer, not a brochure.
          </h2>
          <p style={{ color: "var(--color-muted)", lineHeight: 1.65, maxWidth: "42ch" }}>
            The tools give you the numbers. Akshay gives you the context, what they mean for your suburb, your budget, and your timeline. One free call, no obligation.
          </p>
        </div>

        <div className="reveal flex flex-col gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-colors duration-200"
            style={{
              background: "var(--color-gold)",
              color: "var(--color-bg)",
              letterSpacing: "0.06em",
              minWidth: "220px",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-gold-bright)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--color-gold)")}
          >
            Book a free call
          </Link>
          <Link
            to="/tools/valuation"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium border transition-colors duration-200"
            style={{
              border: "1px solid var(--color-line)",
              color: "var(--color-muted)",
              minWidth: "220px",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "var(--color-text)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "var(--color-muted)";
              e.currentTarget.style.borderColor = "var(--color-line)";
            }}
          >
            Start with the free tools
          </Link>
        </div>
      </div>
    </section>
  );
}
