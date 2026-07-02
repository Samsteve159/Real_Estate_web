import { Link } from "react-router-dom";
import ServicePage from "../components/ServicePage";

/* The broker-grade tools now live under Property Advisory. Each opens the
   existing tool route; the concierge card opens the floating assistant. */
const TOOLS: { no: string; title: string; hook: string; to?: string; action?: "concierge" }[] = [
  { no: "01", title: "Instant Valuation", hook: "An indicative price range for any Melbourne property, from real sales data.", to: "/tools/valuation" },
  { no: "02", title: "AI Buyer Concierge", hook: "Ask anything about buying in Melbourne, any time.", action: "concierge" },
  { no: "03", title: "Stamp Duty", hook: "Your exact VIC duty, including first-home concessions.", to: "/tools/stamp-duty" },
  { no: "04", title: "Borrowing Capacity", hook: "What you can borrow, your deposit gap and upfront costs.", to: "/tools/pre-buying" },
  { no: "05", title: "Portfolio Assessment", hook: "Your position, equity and where to look next.", to: "/tools/portfolio" },
  { no: "06", title: "Rental Yield & Cash Flow", hook: "Gross and net yield, and the weekly cost or return.", to: "/tools/rental" },
];

function ToolsSection() {
  return (
    <section className="border-t" style={{ borderColor: "var(--color-line)" }}>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="reveal max-w-2xl mb-10">
          <p className="eyebrow mb-4">Tools to think it through</p>
          <h2 className="display mb-4" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "var(--color-text)" }}>
            Broker-grade tools, free to use.
          </h2>
          <p className="text-sm" style={{ color: "var(--color-muted)", lineHeight: 1.65 }}>
            Run the numbers yourself before we talk. First-home buyer? Follow the{" "}
            <Link to="/first-home-buyers/steps" className="gold-underline" style={{ color: "var(--color-gold)" }}>7-step buyer journey</Link>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--color-line)" }}>
          {TOOLS.map((t, i) => {
            const inner = (
              <>
                <span className="font-display font-semibold mb-6" style={{ color: "var(--color-gold)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>{t.no}</span>
                <span className="font-display font-semibold mb-2" style={{ color: "var(--color-text)", fontSize: "1.05rem", lineHeight: 1.2 }}>{t.title}</span>
                <span className="text-sm flex-1" style={{ color: "var(--color-muted)", lineHeight: 1.5 }}>{t.hook}</span>
                <span className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
                  {t.action === "concierge" ? "Open chat" : "Open tool"}
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </>
            );
            const cls = "reveal group text-left p-7 flex flex-col h-full card-lift";
            const style = { background: "var(--color-bg)", transitionDelay: `${i * 40}ms` } as React.CSSProperties;
            return t.action === "concierge" ? (
              <button key={t.title} className={cls} style={style}
                onClick={() => window.dispatchEvent(new CustomEvent("manifest:open-concierge"))}>
                {inner}
              </button>
            ) : (
              <Link key={t.title} to={t.to!} className={cls} style={style}>{inner}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function PropertyAdvisoryPage() {
  return (
    <ServicePage
      eyebrow="Property Advisory"
      title={<>Property<br />advisory.</>}
      intro={[
        "Every property decision benefits from informed advice.",
        "Manifest Real Estate provides strategic property advisory services for homeowners, investors, developers and businesses seeking clarity before making important decisions.",
        "Our advisory approach combines market knowledge, research and practical experience to help clients identify opportunities and manage risk.",
      ]}
      listLabel="Areas of advice"
      items={[
        "Property Acquisition",
        "Investment Strategy",
        "Development Opportunities",
        "Site Identification",
        "Highest & Best Use",
        "Market Insights",
      ]}
      ctaTitle="Want clarity before you commit?"
      ctaLabel="Book a conversation"
    >
      <ToolsSection />
    </ServicePage>
  );
}
