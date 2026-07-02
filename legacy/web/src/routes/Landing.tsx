import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SuburbMarquee from "../components/SuburbMarquee";
import ListingsSection from "../components/ListingsSection";

export default function Landing() {
  return (
    <>
      <Hero />
      <SuburbMarquee />
      <TwoTools />
      <ListingsSection />
      <ValuationBand />
    </>
  );
}

function TwoTools() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="eyebrow text-terra">Two tools, one edge</p>
      <h2 className="display mt-3 max-w-2xl text-5xl text-ink sm:text-6xl">
        The things a template site simply can't do.
      </h2>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <ToolCard
          n="01"
          tag="For sellers"
          title="Instant Home Valuation"
          body="Enter an address and a few details. Our AI reasons over recently-sold comparables and suburb medians to return an honest indicative range — then invites the owner to book a real appraisal."
          to="/valuation"
          cta="Try the valuation"
        />
        <ToolCard
          n="02"
          tag="For buyers"
          title="AI Buyer Concierge"
          body="A 24/7 chat that actually knows the stock. It searches live listings on demand, talks suburbs and budgets like a local, and books inspections — capturing the lead while the agency sleeps."
          to="#"
          cta="Open the concierge ↘"
          concierge
        />
      </div>
    </section>
  );
}

function ToolCard({
  n,
  tag,
  title,
  body,
  to,
  cta,
  concierge,
}: {
  n: string;
  tag: string;
  title: string;
  body: string;
  to: string;
  cta: string;
  concierge?: boolean;
}) {
  const inner = (
    <div className="group flex h-full flex-col rounded-2xl border hairline bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(13,27,42,0.4)]">
      <div className="flex items-center justify-between">
        <span className="display text-6xl text-bone-deep transition-colors group-hover:text-teal-pale">
          {n}
        </span>
        <span className="eyebrow rounded-full bg-bone px-3 py-1.5 text-teal">{tag}</span>
      </div>
      <h3 className="display mt-6 text-4xl text-ink">{title}</h3>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted">{body}</p>
      <span className="mt-6 inline-flex items-center gap-2 font-semibold text-terra">
        {cta}
      </span>
    </div>
  );

  if (concierge) {
    // Nudge the floating widget open via hash; harmless if already open.
    return <div>{inner}</div>;
  }
  return <Link to={to}>{inner}</Link>;
}

function ValuationBand() {
  return (
    <section className="contours border-y hairline bg-bone-deep/40">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow text-terra">No address required to start</p>
          <h2 className="display mt-3 max-w-xl text-4xl text-ink sm:text-5xl">
            Curious what your place is worth in today's market?
          </h2>
        </div>
        <Link
          to="/valuation"
          className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-navy px-7 py-4 text-paper transition-colors hover:bg-navy-soft"
        >
          <span className="font-semibold">Get my estimate</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
