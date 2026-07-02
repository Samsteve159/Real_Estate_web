import { useEffect, useState } from "react";
import InfoHint from "../components/InfoHint";
import { useReveal } from "../lib/useReveal";
import {
  getSuburbs,
  requestValuation,
  submitLead,
  type Suburb,
  type ValuationRequest,
  type ValuationResult,
} from "../lib/api";

/* ------------------------------------------------------------------ *
 *  Instant Valuation, attributes → indicative range over comps.
 *  Calls the Hono API (/api/valuation), which grounds the estimate in
 *  recently-sold comparables and re-binds comp prices to ground truth.
 * ------------------------------------------------------------------ */

const PROPERTY_TYPES = ["House", "Townhouse", "Unit", "Apartment", "Land"];
const fmt = (n: number) => "$" + n.toLocaleString("en-AU");

const CONFIDENCE: Record<string, { label: string; color: string }> = {
  high: { label: "High confidence", color: "var(--color-gold)" },
  medium: { label: "Medium confidence", color: "var(--color-gold-dim)" },
  low: { label: "Lower confidence", color: "var(--color-muted)" },
};

export default function ValuationPage() {
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;

  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [form, setForm] = useState<ValuationRequest>({
    suburb: "",
    street: "",
    type: "House",
    beds: 3,
    baths: 2,
    cars: 1,
    landSize: undefined,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSuburbs()
      .then((s) => {
        setSuburbs(s);
        setForm((f) => (f.suburb ? f : { ...f, suburb: s[0]?.name ?? "" }));
      })
      .catch(() => setSuburbs([])); // fall back to free-text entry
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.suburb.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const r = await requestValuation(form);
      setResult(r);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const update = <K extends keyof ValuationRequest>(k: K, v: ValuationRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "9rem" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-6xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="reveal mb-14 max-w-2xl">
          <p className="eyebrow mb-4">Instant valuation</p>
          <h1 className="display mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--color-text)" }}>
            What's your home<br />really worth?
          </h1>
          <p style={{ color: "var(--color-muted)", maxWidth: "48ch", lineHeight: 1.65 }}>
            An indicative price range in seconds, grounded in recent comparable sales in your suburb, 
            not a black-box guess. For the real number, AK walks your home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px reveal" style={{ background: "var(--color-line)" }}>

          {/* FORM */}
          <form onSubmit={onSubmit} className="p-8 sm:p-10 flex flex-col gap-6" style={{ background: "var(--color-surface)" }}>
            <Field label="Suburb">
              {suburbs.length > 0 ? (
                <Select value={form.suburb} onChange={(v) => update("suburb", v)}>
                  {suburbs.map((s) => (
                    <option key={s.name} value={s.name}>{s.name} {s.postcode}</option>
                  ))}
                </Select>
              ) : (
                <TextInput value={form.suburb} onChange={(v) => update("suburb", v)} placeholder="e.g. Yarraville" />
              )}
            </Field>

            <Field label="Street address (optional)">
              <TextInput value={form.street ?? ""} onChange={(v) => update("street", v)} placeholder="e.g. 12 Anderson Street" />
            </Field>

            <Field label="Property type">
              <Select value={form.type} onChange={(v) => update("type", v)}>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Beds"><Stepper value={form.beds} onChange={(v) => update("beds", v)} min={0} max={12} /></Field>
              <Field label="Baths"><Stepper value={form.baths} onChange={(v) => update("baths", v)} min={0} max={12} /></Field>
              <Field label="Cars"><Stepper value={form.cars} onChange={(v) => update("cars", v)} min={0} max={12} /></Field>
            </div>

            <Field label="Land size (sqm, optional)" hint="The area of the block in square metres, if you know it.">
              <TextInput
                value={form.landSize ? String(form.landSize) : ""}
                onChange={(v) => update("landSize", v ? parseInt(v.replace(/[^0-9]/g, ""), 10) || undefined : undefined)}
                placeholder="e.g. 450"
              />
            </Field>

            <button
              type="submit"
              disabled={status === "loading" || !form.suburb.trim()}
              className="mt-2 px-7 py-3.5 text-sm font-semibold transition-colors disabled:opacity-50"
              style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
            >
              {status === "loading" ? "Valuing…" : "Get my indicative range"}
            </button>
            <p className="text-xs" style={{ color: "var(--color-dim)" }}>
              Indicative estimate only, not a formal appraisal.
            </p>
          </form>

          {/* RESULT */}
          <div className="p-8 sm:p-10 flex flex-col" style={{ background: "var(--color-surface-2)" }}>
            {status === "done" && result ? (
              <ResultView result={result} subject={form} />
            ) : status === "loading" ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <p style={{ color: "var(--color-muted)" }}>Reading the comparable sales…</p>
              </div>
            ) : status === "error" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <p style={{ color: "var(--color-muted)" }}>{error}</p>
                <p className="text-xs" style={{ color: "var(--color-dim)" }}>
                  Make sure the API is running (<code>cd api &amp;&amp; npm run dev</code>).
                </p>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <p style={{ color: "var(--color-dim)", maxWidth: "32ch" }}>
                  Fill in your property and we'll show an indicative range with the comparable sales behind it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Result + lead capture ---- */
function ResultView({ result, subject }: { result: ValuationResult; subject: ValuationRequest }) {
  const conf = CONFIDENCE[result.confidence] ?? CONFIDENCE.medium;
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <p className="eyebrow">Indicative range <InfoHint text="An estimated price band for your home from recent comparable sales, not a formal valuation." /></p>
        <span className="text-xs font-semibold uppercase flex items-center gap-1" style={{ color: conf.color, letterSpacing: "0.15em" }}>{conf.label} <InfoHint text="How reliable the estimate is, based on how many close comparable sales were found." /></span>
      </div>
      <p className="display mb-3" style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.6rem)", color: "var(--color-gold)", letterSpacing: "-0.02em" }}>
        {fmt(result.low)} <span style={{ color: "var(--color-dim)" }}>–</span> {fmt(result.high)}
      </p>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        Midpoint <span className="font-semibold" style={{ color: "var(--color-text)" }}>{fmt(result.midpoint)}</span> <InfoHint text="The middle of the estimated range, a single best-guess figure." />
        {" · "}{subject.beds} bed {subject.type.toLowerCase()} in {subject.suburb}
      </p>
      <p className="text-sm leading-relaxed pb-6 mb-6 border-b" style={{ color: "var(--color-text)", borderColor: "var(--color-line)" }}>
        {result.rationale}
      </p>

      {result.comparables_used.length > 0 && (
        <>
          <p className="eyebrow mb-3">Comparable sales used <InfoHint text="Recently sold homes similar to yours that this estimate is built from." /></p>
          <ul className="flex flex-col">
            {result.comparables_used.map((c, i) => (
              <li key={i} className="flex items-start justify-between gap-4 py-3 border-b" style={{ borderColor: "var(--color-line)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{c.address}</p>
                  <p className="text-xs" style={{ color: "var(--color-dim)" }}>{c.note}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-gold)" }}>{fmt(c.sold_price)}</p>
                  <p className="text-xs" style={{ color: "var(--color-dim)" }}>Sold {c.sold_date}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8"><LeadCapture result={result} subject={subject} /></div>
    </>
  );
}

function LeadCapture({ result, subject }: { result: ValuationResult; subject: ValuationRequest }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setState("saving");
    try {
      await submitLead({
        name: name.trim(),
        email: isEmail(contact) ? contact.trim() : undefined,
        phone: isEmail(contact) ? undefined : contact.trim(),
        suburb: subject.suburb,
        address: subject.street ? `${subject.street}, ${subject.suburb}` : subject.suburb,
        estimateLow: result.low,
        estimateHigh: result.high,
        estimateMid: result.midpoint,
        message: `${subject.beds}bd/${subject.baths}ba/${subject.cars}car ${subject.type}`,
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="p-6 border" style={{ background: "rgba(194,162,103,0.08)", borderColor: "var(--color-line-gold)" }}>
        <p className="font-display font-semibold text-lg mb-1" style={{ color: "var(--color-gold)" }}>You're booked in ◆</p>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Thanks {name.split(" ")[0]}, AK will be in touch to arrange a proper on-site appraisal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="p-6 border" style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}>
      <p className="eyebrow mb-1">The real number</p>
      <p className="text-sm mb-4" style={{ color: "var(--color-muted)" }}>
        An estimate is a starting point. Get a free, no-obligation appraisal from AK.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
          className="px-4 py-3 text-sm bg-transparent outline-none border"
          style={{ color: "var(--color-text)", borderColor: "var(--color-line)" }}
        />
        <input
          value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone or email"
          className="px-4 py-3 text-sm bg-transparent outline-none border"
          style={{ color: "var(--color-text)", borderColor: "var(--color-line)" }}
        />
      </div>
      <button
        type="submit" disabled={state === "saving" || !name.trim() || !contact.trim()}
        className="w-full py-3 text-sm font-semibold transition-colors disabled:opacity-50"
        style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
      >
        {state === "saving" ? "Sending…" : "Book my free appraisal"}
      </button>
      {state === "error" && <p className="text-xs mt-2" style={{ color: "var(--color-gold-bright)" }}>Something went wrong, please try again.</p>}
    </form>
  );
}

/* ---- Form primitives ---- */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2.5">{label}{hint && <> <InfoHint text={hint} /></>}</span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 text-sm bg-transparent outline-none border transition-colors"
      style={{ color: "var(--color-text)", borderColor: "var(--color-line)", background: "var(--color-bg)" }}
    />
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 text-sm outline-none border appearance-none"
      style={{ color: "var(--color-text)", borderColor: "var(--color-line)", background: "var(--color-bg)" }}
    >
      {children}
    </select>
  );
}

function Stepper({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center border" style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="px-3 py-3 text-lg" style={{ color: "var(--color-muted)" }} aria-label="Decrease">−</button>
      <span className="flex-1 text-center font-display font-semibold" style={{ color: "var(--color-text)" }}>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="px-3 py-3 text-lg" style={{ color: "var(--color-muted)" }} aria-label="Increase">+</button>
    </div>
  );
}
