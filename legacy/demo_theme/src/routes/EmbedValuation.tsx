import { useState } from "react";
import ValuationForm from "../components/ValuationForm";
import ValuationResultView from "../components/ValuationResult";
import { requestValuation, type ValuationRequest, type ValuationResult } from "../lib/api";
import { useEmbedAutoresize } from "../lib/embed";

/**
 * Chrome-less valuation tool for iframe embedding. Same orchestration as the
 * /valuation route but without the page intro/nav, and it reports its height to
 * the host so the iframe can auto-resize as the form → result grows.
 */
export default function EmbedValuation() {
  const ref = useEmbedAutoresize();
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
    <div ref={ref} className="bg-bone p-4 sm:p-6">
      {!result && <ValuationForm onSubmit={run} loading={loading} />}

      {error && (
        <p className="mt-6 rounded-xl border hairline bg-paper p-5 text-sm text-terra">
          {error}. Please try again in a moment.
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
  );
}
