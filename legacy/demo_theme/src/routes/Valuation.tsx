import { useState } from "react";
import { Link } from "react-router-dom";
import ValuationForm from "../components/ValuationForm";
import ValuationResultView from "../components/ValuationResult";
import { requestValuation, type ValuationRequest, type ValuationResult } from "../lib/api";

export default function Valuation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [subject, setSubject] = useState<ValuationRequest | null>(null);

  async function run(req: ValuationRequest) {
    setLoading(true);
    setError(null);
    setResult(null);
    setSubject(req);
    try {
      setResult(await requestValuation(req));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <Link to="/" className="link-underline pb-0.5 text-sm text-muted hover:text-ink">
        ← Back to Manifest
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-12">
        {/* Intro column */}
        <div className="lg:col-span-5">
          <p className="eyebrow text-terra">Instant home valuation</p>
          <h1 className="display mt-4 text-5xl text-ink sm:text-6xl">
            What's your home <span className="italic text-terra">really</span> worth?
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Tell us about the property. Our AI weighs recently-sold comparables and
            suburb trends to give you an honest indicative range in seconds.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-ink">
            <Point>Grounded in real recently-sold sales nearby</Point>
            <Point>A clear low–high range with the reasoning shown</Point>
            <Point>Free, with no obligation — and no spam</Point>
          </ul>

          <p className="mt-8 rounded-xl border hairline bg-paper p-4 text-xs leading-relaxed text-muted">
            This is an <span className="font-semibold text-ink">indicative estimate</span>,
            not a formal valuation. The most accurate figure always comes from a local
            agent seeing the home in person.
          </p>
        </div>

        {/* Tool column */}
        <div className="lg:col-span-7">
          {!result && <ValuationForm onSubmit={run} loading={loading} />}

          {error && (
            <p className="mt-6 rounded-xl border hairline bg-paper p-5 text-sm text-terra">
              {error}. Make sure the API is running and your ANTHROPIC_API_KEY is set.
            </p>
          )}

          {result && subject && (
            <>
              <ValuationResultView result={result} subject={subject} />
              <button
                onClick={() => {
                  setResult(null);
                  setSubject(null);
                }}
                className="mt-6 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                ← Value another property
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-xs text-paper">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}
