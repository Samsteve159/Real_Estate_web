import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";

/* ------------------------------------------------------------------ *
 *  About, agency story, values, the broker-grade difference.
 *  NOTE: bio specifics, photo and any credentials are placeholders; 
 *  confirm with Akshay before launch.
 * ------------------------------------------------------------------ */

const VALUES = [
  { title: "Integrity", body: "We do what we say, and we tell you what you need to hear — not just what's easy." },
  { title: "Professionalism", body: "Considered advice, clear communication and a process you can rely on at every stage." },
  { title: "Knowledge", body: "Local market insight and research that turn complex decisions into clear ones." },
  { title: "Relationships", body: "We build lasting relationships, which is why so much of our work comes through referral." },
  { title: "Results", body: "Everything we do is measured against one thing — the outcome we achieve for you." },
];

export default function AboutPage() {
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={{ background: "var(--color-bg)", paddingTop: "9rem" }}>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="reveal max-w-3xl">
          <p className="eyebrow mb-4">About Manifest Real Estate</p>
          <p className="font-display italic mb-6" style={{ color: "var(--color-gold)", fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)", lineHeight: 1.4 }}>
            Welcome to Manifest Real Estate, where dreams meet reality.
          </p>
          <h1 className="display mb-7" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "var(--color-text)", lineHeight: 1.08 }}>
            More than a<br />transactional approach.
          </h1>
          <div className="flex flex-col gap-4" style={{ color: "var(--color-muted)", maxWidth: "58ch", lineHeight: 1.7, fontSize: "1.08rem" }}>
            <p>
              Manifest Real Estate was founded on the belief that property decisions deserve more than a transactional approach.
            </p>
            <p>
              Every client, property and opportunity is different. Our role is to understand your objectives, provide informed advice and guide you through the process with transparency and professionalism.
            </p>
            <p>
              Whether working with homeowners, investors, developers or business owners, we focus on building lasting relationships through trust, integrity and consistent results. Our approach combines local knowledge, strategic thinking and personalised service to help clients make confident property decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Co-founders */}
      <section className="border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="reveal display mb-14" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)", color: "var(--color-text)" }}>
            Meet the Directors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

            {/* Rishi */}
            <div className="reveal">
              <p className="eyebrow mb-2" style={{ color: "var(--color-gold)" }}>Director</p>
              <h3 className="display mb-5" style={{ fontSize: "1.5rem", color: "var(--color-text)" }}>Rishi Vohra</h3>
              <img
                src={`${import.meta.env.BASE_URL}rishi-vohra.jpg`}
                alt="Rishi Vohra, Director at Manifest Real Estate"
                className="w-full max-w-[220px] aspect-[4/5] object-cover object-top mb-6"
                style={{
                  border: "1px solid var(--color-line)",
                  borderTop: "2px solid var(--color-gold)",
                  // Photo is pre-cropped tight to the subject; a light tone-down
                  // keeps the studio backdrop close to Akshay's grey on the dark theme.
                  filter: "brightness(0.92) contrast(1.05) saturate(1.03)",
                }}
              />
              <div className="flex flex-col gap-4" style={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
                <p>
                  Rishi is an extremely hard-working, approachable and ethical operator who willingly
                  goes above and beyond for both colleagues and clients. Honesty, transparency, empathy
                  and total professionalism, matched with the best possible sale price through superior
                  negotiation, keep his clients satisfied time and time again.
                </p>
                <p>
                  He offers clients the ultimate real estate experience, bringing a whole new level of
                  personalised service to everyone he works with, which is how he continues to grow his
                  extensive network.
                </p>
              </div>
              {/* Real client review for Rishi (supplied by Akshay, 2026-07-02). */}
              <blockquote className="mt-6 pl-5" style={{ borderLeft: "2px solid var(--color-gold)" }}>
                <p className="font-display italic" style={{ color: "var(--color-text)", fontSize: "1.1rem", lineHeight: 1.5 }}>
                  "Rishi really knows what he is doing. Really competent. I am really happy to be doing business with him."
                </p>
              </blockquote>
            </div>

            {/* Akshay */}
            <div className="reveal">
              <p className="eyebrow mb-2" style={{ color: "var(--color-gold)" }}>Director</p>
              <h3 className="display mb-5" style={{ fontSize: "1.5rem", color: "var(--color-text)" }}>Akshay Kapoor (AK)</h3>
              <img
                src={`${import.meta.env.BASE_URL}akshay-kapoor.jpg`}
                alt="Akshay Kapoor (AK), Director at Manifest Real Estate"
                className="w-full max-w-[220px] aspect-[4/5] object-cover object-top mb-6"
                style={{ border: "1px solid var(--color-line)", borderTop: "2px solid var(--color-gold)" }}
              />
              <div className="flex flex-col gap-4" style={{ color: "var(--color-muted)", lineHeight: 1.7 }}>
                <p>
                  At Manifest, the name <em>is</em> the brief, turning a client's manifestations into
                  reality. Akshay built his business on three things: clear communication, genuine
                  service, and trust. Property is his passion, and it shows in how he adapts to what each
                  client actually needs, rather than running a script.
                </p>
                <p>
                  He has worked across the lot, small land, houses, development sites and acreage, and
                  holds property in his own portfolio, so the advice comes from someone who has sat on
                  your side of the table. Clients describe him as responsive, proactive and easy to deal
                  with, which is why so much of his work comes through referrals.
                </p>
              </div>
              <blockquote className="mt-6 pl-5" style={{ borderLeft: "2px solid var(--color-gold)" }}>
                <p className="font-display italic" style={{ color: "var(--color-text)", fontSize: "1.1rem", lineHeight: 1.5 }}>
                  "He has a knack to evolve and become more efficient with the ever-changing market."
                </p>
              </blockquote>
            </div>
          </div>

          <div className="reveal mt-14">
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
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="reveal eyebrow mb-6">Our mission</p>
        <p className="reveal display mx-auto" style={{ color: "var(--color-text)", fontSize: "clamp(1.5rem, 3.5vw, 2.3rem)", lineHeight: 1.35, maxWidth: "24ch" }}>
          To deliver trusted property advice and exceptional outcomes through genuine relationships, market expertise and a commitment to excellence.
        </p>
      </section>

      {/* Values */}
      <section className="border-t" style={{ borderColor: "var(--color-line)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="reveal eyebrow mb-10">What we stand for</p>
          {/* Centred flex so the five values never leave a dangling empty cell:
              3-up on desktop (3 + 2 centred), 2-up on tablet, stacked on mobile. */}
          <div className="flex flex-wrap justify-center gap-5">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="reveal p-8 w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-line)",
                  borderTop: "2px solid var(--color-gold)",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <p className="font-display font-semibold mb-3" style={{ color: "var(--color-gold)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
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
          <p className="reveal eyebrow mb-5">Start the conversation</p>
          <h2 className="reveal display mb-6 mx-auto" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "var(--color-text)", maxWidth: "20ch" }}>
            Let's make your next move count.
          </h2>
          <div className="reveal flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="px-7 py-3.5 text-sm font-semibold" style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}>
              Get in touch
            </Link>
            <Link to="/services/property-advisory" className="px-7 py-3.5 text-sm font-semibold border" style={{ borderColor: "var(--color-line-gold)", color: "var(--color-text)" }}>
              Explore our services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
