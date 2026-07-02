import { useState } from "react";
import { submitLead, type ValuationResult, type ValuationRequest } from "../lib/api";

const fmt = (n: number) => "$" + n.toLocaleString("en-AU");

const CONFIDENCE: Record<string, { label: string; cls: string }> = {
  high: { label: "High confidence", cls: "bg-teal text-paper" },
  medium: { label: "Medium confidence", cls: "bg-amber text-navy" },
  low: { label: "Lower confidence", cls: "bg-terra text-paper" },
};

export default function ValuationResultView({
  result,
  subject,
}: {
  result: ValuationResult;
  subject: ValuationRequest;
}) {
  const conf = CONFIDENCE[result.confidence] ?? CONFIDENCE.medium;

  return (
    <div className="pop space-y-6">
      {/* The range — the hero of the result. */}
      <div className="contours rounded-2xl border hairline bg-paper p-7 sm:p-9">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-terra">Indicative range</p>
          <span className={`eyebrow rounded-full px-3 py-1.5 ${conf.cls}`}>{conf.label}</span>
        </div>

        <p className="display mt-5 text-5xl text-ink sm:text-6xl">
          {fmt(result.low)} <span className="text-bone-deep">–</span> {fmt(result.high)}
        </p>
        <p className="mt-3 text-sm text-muted">
          Midpoint <span className="font-semibold text-teal">{fmt(result.midpoint)}</span> ·{" "}
          {subject.beds} bed {subject.type.toLowerCase()} in {subject.suburb}
        </p>

        <p className="mt-6 max-w-2xl border-t hairline pt-6 text-[15px] leading-relaxed text-ink/90">
          {result.rationale}
        </p>
      </div>

      {/* Comparable sales that drove it — honesty + credibility. */}
      {result.comparables_used.length > 0 && (
        <div className="rounded-2xl border hairline bg-paper p-7">
          <p className="eyebrow text-muted">Comparable sales used</p>
          <ul className="mt-4 divide-y hairline">
            {result.comparables_used.map((c, i) => (
              <li key={i} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-ink">{c.address}</p>
                  <p className="text-xs text-muted">{c.note}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-terra">{fmt(c.sold_price)}</p>
                  <p className="text-xs text-muted">Sold {c.sold_date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <LeadCapture result={result} subject={subject} />
    </div>
  );
}

function LeadCapture({
  result,
  subject,
}: {
  result: ValuationResult;
  subject: ValuationRequest;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  function isEmail(v: string) {
    return /\S+@\S+\.\S+/.test(v);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setStatus("saving");
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
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="pop rounded-2xl border-2 border-teal bg-teal-pale/40 p-7 text-center">
        <p className="display text-3xl text-teal">You're booked in ✦</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/80">
          Thanks {name.split(" ")[0]} — Manifest will be in touch to arrange a proper
          on-site appraisal, which is always more accurate than any estimate.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border hairline bg-navy p-7 text-bone sm:p-9">
      <p className="eyebrow text-teal-pale">The real number</p>
      <h3 className="display mt-3 text-3xl text-bone">
        Get an accurate appraisal from Manifest
      </h3>
      <p className="mt-2 max-w-lg text-sm text-bone/70">
        An estimate is a starting point. A local agent walking your home will give you
        the figure you can actually sell on — free, no obligation.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="rounded-lg border border-bone/20 bg-navy-soft px-4 py-3 text-bone placeholder:text-bone/40 focus:border-amber focus:outline-none"
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Phone or email"
          className="rounded-lg border border-bone/20 bg-navy-soft px-4 py-3 text-bone placeholder:text-bone/40 focus:border-amber focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "saving" || !name.trim() || !contact.trim()}
        className="mt-5 w-full rounded-full bg-amber py-3.5 font-semibold text-navy transition-colors hover:bg-terra-soft disabled:opacity-50"
      >
        {status === "saving" ? "Sending…" : "Book my free appraisal"}
      </button>
      {status === "error" && (
        <p className="mt-3 text-sm text-amber">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
