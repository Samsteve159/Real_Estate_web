import { useState } from "react";
import { useReveal } from "../lib/useReveal";
import { submitLead } from "../lib/api";

/* ------------------------------------------------------------------ *
 *  Contact, enquiry form → /api/lead (source: "contact").
 *  NOTE: phone/email/office details are placeholders, confirm with Akshay.
 * ------------------------------------------------------------------ */

const INTENTS = [
  { value: "buy", label: "Buying" },
  { value: "sell", label: "Selling / appraisal" },
  { value: "invest", label: "Investing" },
  { value: "enquiry", label: "Just exploring" },
];

export default function ContactPage() {
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [intent, setIntent] = useState("buy");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setState("saving");
    setError("");
    try {
      await submitLead({
        name: name.trim(),
        email: isEmail(contact) ? contact.trim() : undefined,
        phone: isEmail(contact) ? undefined : contact.trim(),
        source: "contact",
        intent,
        message: message.trim() || undefined,
      });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "6rem" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left, invitation + details */}
        <div className="reveal">
          <p className="eyebrow mb-5">Let's talk</p>
          <h1 className="display mb-6" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", color: "var(--color-text)", lineHeight: 1.08 }}>
            A real conversation,<br />no obligation.
          </h1>
          <p className="mb-10" style={{ color: "var(--color-muted)", maxWidth: "46ch", lineHeight: 1.7 }}>
            Whether you're months from buying or ready to move, a 20-minute chat with AK will give
            you a clearer picture than any algorithm. Tell us where you're at and we'll take it from there.
          </p>

          <div className="flex flex-col gap-6">
            <Detail label="Email" value="admin@manifestre.com.au" href="mailto:admin@manifestre.com.au" />
            <Detail label="Phone" value="+61 403 466 216" href="tel:+61403466216" />
            <Detail label="Office" value="2 Blackwood Drive, Altona North VIC 3025" />
            <Detail label="Servicing" value="Melbourne, inner west & northern growth corridors" />
          </div>
        </div>

        {/* Right, form */}
        <div className="reveal">
          {state === "done" ? (
            <div className="p-8 border h-full flex flex-col justify-center" style={{ background: "var(--color-surface)", borderColor: "var(--color-line-gold)" }}>
              <p className="font-display font-semibold text-2xl mb-2" style={{ color: "var(--color-gold)" }}>Thanks {name.split(" ")[0]} ◆</p>
              <p className="text-sm" style={{ color: "var(--color-muted)", lineHeight: 1.6 }}>
                Your message is in. AK will be in touch shortly, usually within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="p-8 sm:p-10 border flex flex-col gap-6" style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}>
              <label className="block">
                <span className="eyebrow block mb-2.5">Your name</span>
                <Input value={name} onChange={setName} placeholder="First and last name" />
              </label>
              <label className="block">
                <span className="eyebrow block mb-2.5">Phone or email</span>
                <Input value={contact} onChange={setContact} placeholder="So we can reach you" />
              </label>
              <div>
                <span className="eyebrow block mb-2.5">I'm interested in</span>
                <div className="flex flex-wrap gap-2">
                  {INTENTS.map((o) => {
                    const active = intent === o.value;
                    return (
                      <button
                        key={o.value} type="button" onClick={() => setIntent(o.value)}
                        className="px-4 py-2 text-xs font-medium transition-colors"
                        style={{
                          background: active ? "rgba(194,162,103,0.12)" : "var(--color-bg)",
                          color: active ? "var(--color-gold)" : "var(--color-muted)",
                          border: `1px solid ${active ? "var(--color-line-gold)" : "var(--color-line)"}`,
                        }}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="block">
                <span className="eyebrow block mb-2.5">Anything else? (optional)</span>
                <textarea
                  value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
                  placeholder="Suburbs you're watching, budget, timing…"
                  className="w-full px-4 py-3 text-sm bg-transparent outline-none border resize-none"
                  style={{ color: "var(--color-text)", borderColor: "var(--color-line)", background: "var(--color-bg)" }}
                />
              </label>
              <button
                type="submit" disabled={state === "saving" || !name.trim() || !contact.trim()}
                className="px-7 py-3.5 text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
              >
                {state === "saving" ? "Sending…" : "Send message"}
              </button>
              {state === "error" && <p className="text-xs" style={{ color: "var(--color-gold-bright)" }}>{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="pb-5 border-b" style={{ borderColor: "var(--color-line)" }}>
      <p className="eyebrow mb-1.5">{label}</p>
      {href ? (
        <a href={href} className="text-sm gold-underline" style={{ color: "var(--color-text)" }}>{value}</a>
      ) : (
        <p className="text-sm" style={{ color: "var(--color-text)" }}>{value}</p>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 text-sm bg-transparent outline-none border"
      style={{ color: "var(--color-text)", borderColor: "var(--color-line)", background: "var(--color-bg)" }}
    />
  );
}
