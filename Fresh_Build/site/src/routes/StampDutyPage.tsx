import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";
import { calculateDuty, formatAUD, type BuyerType } from "../lib/stampDuty";

/* ------------------------------------------------------------------ *
 *  VIC Stamp Duty Calculator
 *  Deterministic, every figure comes straight from the SRO schedule
 *  in ../lib/stampDuty.ts. No estimates, no AI in the number.
 * ------------------------------------------------------------------ */

const BUYER_OPTIONS: { value: BuyerType; label: string; hint: string }[] = [
  { value: "fhb",      label: "First home buyer",  hint: "Buying your first home to live in" },
  { value: "ppr",      label: "Home to live in",   hint: "Owner-occupier, not your first home" },
  { value: "investor", label: "Investment",        hint: "Investor / not a primary residence" },
];

export default function StampDutyPage() {
  const ref = useReveal(0.08) as React.RefObject<HTMLElement>;

  const [price, setPrice] = useState<string>("650000");
  const [buyerType, setBuyerType] = useState<BuyerType>("fhb");
  const [foreign, setForeign] = useState(false);

  const value = useMemo(() => {
    const n = parseInt(price.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  }, [price]);

  const result = useMemo(
    () => calculateDuty({ dutiableValue: value, buyerType, foreignPurchaser: foreign }),
    [value, buyerType, foreign]
  );

  const hasInput = value > 0;
  const effectiveRate = hasInput ? (result.totalPayable / value) * 100 : 0;

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "6rem" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-6xl mx-auto px-6 py-20">

        {/* ---- Header ---- */}
        <div className="reveal mb-14 max-w-2xl">
          <p className="eyebrow mb-4">Victoria · Land transfer duty</p>
          <h1 className="display mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--color-text)" }}>
            Know your stamp duty<br />before you bid.
          </h1>
          <p style={{ color: "var(--color-muted)", maxWidth: "48ch", lineHeight: 1.65 }}>
            The exact land transfer duty on a Victorian purchase, including the first-home buyer
            exemption and concession. Calculated directly from the{" "}
            <a
              href="https://www.sro.vic.gov.au/land-transfer-duty"
              target="_blank"
              rel="noopener noreferrer"
              className="gold-underline"
              style={{ color: "var(--color-gold)" }}
            >
              State Revenue Office
            </a>{" "}
            schedule. No estimates.
          </p>
        </div>

        {/* ---- Calculator: input + result ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px reveal" style={{ background: "var(--color-line)" }}>

          {/* INPUT PANEL */}
          <div className="p-8 sm:p-10" style={{ background: "var(--color-surface)" }}>

            {/* Purchase price */}
            <label className="block mb-8">
              <span className="eyebrow block mb-3">Purchase price</span>
              <div
                className="flex items-center px-4 py-3 border transition-colors"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-line)" }}
              >
                <span style={{ color: "var(--color-gold)", fontSize: "1.4rem", marginRight: "0.4rem" }}>$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={price ? Number(price.replace(/[^0-9]/g, "")).toLocaleString("en-AU") : ""}
                  onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="650,000"
                  aria-label="Purchase price in Australian dollars"
                  className="w-full bg-transparent outline-none font-display"
                  style={{ color: "var(--color-text)", fontSize: "1.6rem", fontWeight: 600, letterSpacing: "-0.01em" }}
                />
              </div>
              {/* Quick presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[500_000, 650_000, 750_000, 900_000, 1_200_000].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrice(String(p))}
                    className="px-3 py-1.5 text-xs transition-colors"
                    style={{
                      background: value === p ? "rgba(194,162,103,0.14)" : "var(--color-bg)",
                      color: value === p ? "var(--color-gold)" : "var(--color-dim)",
                      border: `1px solid ${value === p ? "var(--color-line-gold)" : "var(--color-line)"}`,
                    }}
                  >
                    ${(p / 1000).toLocaleString()}k
                  </button>
                ))}
              </div>
            </label>

            {/* Buyer type */}
            <div className="mb-8">
              <span className="eyebrow block mb-3">I'm buying as</span>
              <div className="flex flex-col gap-2">
                {BUYER_OPTIONS.map((opt) => {
                  const active = buyerType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setBuyerType(opt.value)}
                      className="flex items-start gap-3 px-4 py-3 text-left transition-colors"
                      style={{
                        background: active ? "rgba(194,162,103,0.08)" : "var(--color-bg)",
                        border: `1px solid ${active ? "var(--color-line-gold)" : "var(--color-line)"}`,
                      }}
                    >
                      <span
                        className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                        style={{ border: `1px solid ${active ? "var(--color-gold)" : "var(--color-dim)"}` }}
                        aria-hidden="true"
                      >
                        {active && <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-gold)" }} />}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold" style={{ color: active ? "var(--color-text)" : "var(--color-muted)" }}>
                          {opt.label}
                        </span>
                        <span className="block text-xs mt-0.5" style={{ color: "var(--color-dim)" }}>{opt.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Foreign purchaser toggle */}
            <button
              onClick={() => setForeign((v) => !v)}
              className="flex items-center gap-3 w-full"
              aria-pressed={foreign}
            >
              <span
                className="relative w-9 h-5 rounded-full transition-colors shrink-0"
                style={{ background: foreign ? "var(--color-gold)" : "var(--color-surface-3)" }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                  style={{ background: foreign ? "var(--color-bg)" : "var(--color-muted)", left: "2px", transform: foreign ? "translateX(16px)" : "none" }}
                />
              </span>
              <span className="text-xs text-left" style={{ color: "var(--color-muted)" }}>
                Foreign purchaser <span style={{ color: "var(--color-dim)" }}>,  adds 8% additional duty</span>
              </span>
            </button>
          </div>

          {/* RESULT PANEL */}
          <div className="p-8 sm:p-10 flex flex-col" style={{ background: "var(--color-surface-2)" }}>
            {hasInput ? (
              <>
                <p className="eyebrow mb-2">Duty payable</p>
                <p
                  className="display mb-1"
                  style={{ fontSize: "clamp(2.4rem, 6vw, 3.6rem)", color: "var(--color-gold)", letterSpacing: "-0.02em" }}
                >
                  {formatAUD(result.totalPayable)}
                </p>
                <p className="text-xs mb-8" style={{ color: "var(--color-dim)" }}>
                  Effective rate {effectiveRate.toFixed(2)}% of purchase price
                </p>

                {/* Breakdown */}
                <div className="flex flex-col gap-3 text-sm mb-6">
                  <Row label="Land transfer duty" value={formatAUD(result.duty, true)} />
                  {result.foreignDuty > 0 && (
                    <Row label="Foreign purchaser duty (8%)" value={formatAUD(result.foreignDuty, true)} />
                  )}
                  {result.saving > 0 && (
                    <Row
                      label={buyerType === "fhb" ? "First home buyer saving" : "Concession saving"}
                      value={`− ${formatAUD(result.saving, true)}`}
                      accent
                    />
                  )}
                </div>

                <div className="pt-5 border-t flex items-center justify-between" style={{ borderColor: "var(--color-line)" }}>
                  <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Total payable</span>
                  <span className="font-display font-semibold" style={{ color: "var(--color-text)", fontSize: "1.2rem" }}>
                    {formatAUD(result.totalPayable)}
                  </span>
                </div>

                {/* Basis note */}
                <p className="text-xs mt-6 leading-relaxed" style={{ color: "var(--color-dim)" }}>
                  {result.basis}
                </p>

                {/* CTA */}
                <div className="mt-auto pt-8">
                  <Link
                    to="/tools/pre-buying"
                    className="inline-flex items-center gap-2 text-sm font-medium gold-underline pb-px"
                    style={{ color: "var(--color-gold)" }}
                  >
                    See your full upfront costs →
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <p style={{ color: "var(--color-dim)" }}>Enter a purchase price to see your duty.</p>
              </div>
            )}
          </div>
        </div>

        {/* ---- Rate schedule reference ---- */}
        <div className="reveal mt-16">
          <p className="eyebrow mb-5">How it's calculated</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RefCard
              title="First home buyers"
              lines={[
                "Up to $600,000, no duty payable",
                "$600,001–$750,000, concession phases in",
                "Above $750,000, general rate applies",
              ]}
            />
            <RefCard
              title="Homes to live in (PPR)"
              lines={[
                "Concessional rate up to $550,000",
                "$130k–$440k, $2,870 + 5% over $130k",
                "Above $550,000, general rate applies",
              ]}
            />
            <RefCard
              title="General / investment"
              lines={[
                "$130k–$960k, $2,870 + 6% over $130k",
                "$960k–$2m, flat 5.5% of value",
                "Above $2m, $110,000 + 6.5% over $2m",
              ]}
            />
          </div>
          <p className="text-xs mt-6" style={{ color: "var(--color-dim)", maxWidth: "60ch", lineHeight: 1.6 }}>
            Figures follow the current SRO Victoria land transfer duty schedule and are an indicative
            calculation, not formal tax advice. Pensioner, off-the-plan and other concessions may
            further reduce your duty, <Link to="/contact" className="gold-underline" style={{ color: "var(--color-gold)" }}>talk to Akshay</Link> to check what you qualify for.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: "var(--color-muted)" }}>{label}</span>
      <span className="font-medium" style={{ color: accent ? "var(--color-gold)" : "var(--color-text)" }}>{value}</span>
    </div>
  );
}

function RefCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="p-6 border" style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}>
      <p className="text-sm font-semibold mb-4" style={{ color: "var(--color-text)" }}>{title}</p>
      <ul className="flex flex-col gap-2.5">
        {lines.map((l) => (
          <li key={l} className="text-xs flex gap-2" style={{ color: "var(--color-muted)", lineHeight: 1.5 }}>
            <span style={{ color: "var(--color-gold)" }}>·</span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
