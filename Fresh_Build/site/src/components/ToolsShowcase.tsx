import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";

interface Tool {
  eyebrow: string;
  title: string;
  description: string;
  to: string;
  cta: string;
  isSignature?: boolean; // the one accented tool in the grid
}

const TOOLS: Tool[] = [
  {
    eyebrow: "Know your number",
    title: "Instant Home Valuation",
    description: "Get an indicative price range for any Melbourne property in seconds, based on real sales data, not guesswork. Free, no login.",
    to: "/tools/valuation",
    cta: "Get an estimate",
    isSignature: true,
  },
  {
    eyebrow: "Explore with confidence",
    title: "AI Buyer Concierge",
    description: "Ask anything about buying in Melbourne. Our AI searches real listings, explains suburb data, and helps you prepare, like having a broker in your pocket.",
    to: "/tools/concierge",
    cta: "Start a conversation",
  },
  {
    eyebrow: "Victoria only",
    title: "Stamp Duty Calculator",
    description: "The exact VIC stamp duty figure for your purchase price, including first-home buyer concessions. Updated to match the SRO.vic.gov.au schedule.",
    to: "/tools/stamp-duty",
    cta: "Calculate now",
  },
  {
    eyebrow: "Before you search",
    title: "Pre-Buying Readiness",
    description: "Know your borrowing capacity, deposit gap, and upfront costs before you fall in love with a property. Realistic numbers, plain language.",
    to: "/tools/pre-buying",
    cta: "Check readiness",
  },
  {
    eyebrow: "Owners & investors",
    title: "Portfolio Assessment",
    description: "See your 1–2 property portfolio's current position, equity, estimated value growth, and where to look next. Clear, honest, actionable.",
    to: "/tools/portfolio",
    cta: "Assess my portfolio",
  },
  {
    eyebrow: "Investors",
    title: "Rental Yield & Cash Flow",
    description: "Work out the gross and net yield on a rental, and what it costs or earns you each week once the mortgage and running costs are in.",
    to: "/tools/rental",
    cta: "Run the numbers",
  },
];

export default function ToolsShowcase() {
  const ref = useReveal(0.1) as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="section-pad"
      style={{ background: "var(--color-bg)" }}
      id="tools"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="reveal mb-16 max-w-2xl">
          <p className="eyebrow mb-4">Broker-grade tools</p>
          <h2
            className="display mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--color-text)" }}
          >
            Everything you'd pay an advisor for.<br />
            <span style={{ color: "var(--color-muted)" }}>Free, on this page.</span>
          </h2>
          <p style={{ color: "var(--color-muted)", lineHeight: 1.65, maxWidth: "46ch" }}>
            We built the tools a good buyer's advocate uses, then made them free for anyone in Melbourne. No referral fee. No pressure.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--color-line)" }}>
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.to} tool={tool} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool, delay }: { tool: Tool; delay: number }) {
  const isSignature = tool.isSignature;

  return (
    <article
      className="reveal card-lift group flex flex-col p-8 lg:p-10"
      style={{
        background: isSignature ? "var(--color-surface-2)" : "var(--color-surface)",
        transitionDelay: `${delay}ms`,
        borderLeft: isSignature ? "2px solid var(--color-gold)" : "none",
      }}
    >
      {/* Eyebrow */}
      <p className="eyebrow mb-5" style={{ opacity: 0.8 }}>{tool.eyebrow}</p>

      {/* Title */}
      <h3
        className="display mb-4 text-xl"
        style={{ color: "var(--color-text)", fontSize: "1.25rem" }}
      >
        {tool.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed flex-1 mb-8"
        style={{ color: "var(--color-muted)" }}
      >
        {tool.description}
      </p>

      {/* CTA link */}
      <Link
        to={tool.to}
        className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
        style={{ color: isSignature ? "var(--color-gold)" : "var(--color-muted)" }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "var(--color-gold)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = isSignature ? "var(--color-gold)" : "var(--color-muted)";
        }}
      >
        {tool.cta}
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className="transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        >
          <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </article>
  );
}
