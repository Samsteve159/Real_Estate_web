import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";

/* ------------------------------------------------------------------ *
 *  About, agency story, values, the broker-grade difference.
 *  NOTE: bio specifics, photo and any credentials are placeholders; 
 *  confirm with Akshay before launch.
 * ------------------------------------------------------------------ */

const VALUES = [
  { title: "No jargon, ever", body: "We explain the number, the process and the risk in plain English. If you don't understand it, we haven't done our job." },
  { title: "Tools, not pressure", body: "Broker-grade calculators and honest estimates up front, so you make the call with the full picture, on your timeline." },
  { title: "Melbourne, deeply", body: "Suburb-level knowledge of the inner west and northern growth corridors, where value sits and where it's heading." },
  { title: "In your corner", body: "First-home buyers and early investors get the same quality of guidance wealthy buyers take for granted." },
];

const STATS = [
  { figure: "5", suffix: "tools", label: "Free, broker-grade, valuation, concierge, stamp duty, pre-buying, portfolio" },
  { figure: "$0", suffix: "", label: "To use every tool on this site, no login, no catch" },
  { figure: "20", suffix: "min", label: "A free, no-obligation conversation to map your next move" },
];

export default function AboutPage() {
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={{ background: "var(--color-bg)", paddingTop: "6rem" }}>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="reveal max-w-3xl">
          <p className="eyebrow mb-5">About Manifest</p>
          <h1 className="display mb-7" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "var(--color-text)", lineHeight: 1.08 }}>
            Broker-grade guidance,<br />without the gatekeeping.
          </h1>
          <p style={{ color: "var(--color-muted)", maxWidth: "56ch", lineHeight: 1.7, fontSize: "1.08rem" }}>
            Manifest Real Estate exists for the buyers the industry usually overlooks, people buying
            their first home, or their first investment. The big end of town has always had advisers,
            data and tools. We put the same firepower in your hands, and pair it with someone who
            actually picks up the phone.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
        <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          <div className="reveal md:col-span-2">
            {/* Placeholder portrait, swap for Akshay's photo */}
            <div
              className="w-full aspect-[4/5] flex items-center justify-center"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
            >
              <span className="eyebrow" style={{ color: "var(--color-dim)" }}>Photo of Akshay</span>
            </div>
          </div>
          <div className="reveal md:col-span-3">
            <p className="eyebrow mb-4">The founder</p>
            <h2 className="display mb-5" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "var(--color-text)" }}>
              Akshay, Director, Manifest Real Estate
            </h2>
            <div className="flex flex-col gap-4" style={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
              <p>
                Akshay started Manifest after watching too many first-home buyers walk into the biggest
                decision of their lives with nothing but a bank pre-approval and a hunch. His belief is
                simple: a well-informed buyer makes a better buyer, and a calmer one.
              </p>
              <p>
                He works across Melbourne's inner west and the northern growth corridors, and brings the
                analytical rigour of a broker to every appraisal and negotiation. No theatrics, no
                pressure, just clear numbers and straight answers.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-colors"
                style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold-bright)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
              >
                Have a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "var(--color-line)" }}>
          {STATS.map((s) => (
            <div key={s.label} className="reveal p-8" style={{ background: "var(--color-bg)" }}>
              <p className="display mb-2" style={{ color: "var(--color-gold)", fontSize: "2.6rem", letterSpacing: "-0.02em" }}>
                {s.figure}<span style={{ fontSize: "1.1rem", marginLeft: "0.25rem", color: "var(--color-gold-dim)" }}>{s.suffix}</span>
              </p>
              <p className="text-sm" style={{ color: "var(--color-muted)", lineHeight: 1.55 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-t" style={{ borderColor: "var(--color-line)" }}>
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="reveal eyebrow mb-10">What we stand for</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--color-line)" }}>
            {VALUES.map((v) => (
              <div key={v.title} className="reveal p-8" style={{ background: "var(--color-bg)" }}>
                <h3 className="font-display font-semibold mb-3" style={{ color: "var(--color-text)", fontSize: "1.15rem" }}>{v.title}</h3>
                <p className="text-sm" style={{ color: "var(--color-muted)", lineHeight: 1.65 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="reveal eyebrow mb-5">Start anywhere</p>
          <h2 className="reveal display mb-6 mx-auto" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "var(--color-text)", maxWidth: "20ch" }}>
            Try the tools. Then let's talk.
          </h2>
          <div className="reveal flex flex-wrap gap-4 justify-center">
            <Link to="/tools/valuation" className="px-7 py-3.5 text-sm font-semibold" style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}>
              Value my home
            </Link>
            <Link to="/contact" className="px-7 py-3.5 text-sm font-semibold border" style={{ borderColor: "var(--color-line-gold)", color: "var(--color-text)" }}>
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
