import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../lib/useReveal";
import { assessPortfolio, type Property } from "../lib/portfolio";
import { formatAUD } from "../lib/stampDuty";

/* ------------------------------------------------------------------ *
 *  Portfolio assessment, equity, leverage & usable equity for the
 *  next purchase. Deterministic (portfolio.ts). No API.
 * ------------------------------------------------------------------ */

let nextId = 2;
const seed: Property[] = [
  { id: "1", label: "Home", value: 850_000, loanBalance: 480_000, weeklyRent: 0 },
];

export default function PortfolioPage() {
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;
  const [properties, setProperties] = useState<Property[]>(seed);

  const r = useMemo(() => assessPortfolio(properties), [properties]);

  const update = (id: string, patch: Partial<Property>) =>
    setProperties((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const add = () =>
    setProperties((ps) => [...ps, { id: String(nextId++), label: `Property ${ps.length + 1}`, value: 600_000, loanBalance: 400_000, weeklyRent: 500 }]);
  const remove = (id: string) => setProperties((ps) => ps.filter((p) => p.id !== id));

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "6rem" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-6xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="reveal mb-14 max-w-2xl">
          <p className="eyebrow mb-4">Portfolio assessment</p>
          <h1 className="display mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--color-text)" }}>
            Where does your<br />property stand?
          </h1>
          <p style={{ color: "var(--color-muted)", maxWidth: "50ch", lineHeight: 1.65 }}>
            Your equity, your leverage, and, the number most owners never see, how much equity you
            could actually release toward the next purchase. Add each property you own.
          </p>
        </div>

        {/* Summary cards */}
        <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-px mb-px" style={{ background: "var(--color-line)" }}>
          <Stat label="Total value" value={formatAUD(r.totalValue)} />
          <Stat label="Total equity" value={formatAUD(r.totalEquity)} accent />
          <Stat label="Portfolio LVR" value={`${r.portfolioLVR.toFixed(1)}%`} />
          <Stat label="Usable equity" value={formatAUD(r.usableEquity)} accent />
        </div>

        {/* Properties */}
        <div className="reveal flex flex-col gap-px" style={{ background: "var(--color-line)" }}>
          {properties.map((p) => {
            const pp = r.perProperty.find((x) => x.id === p.id)!;
            return (
              <div key={p.id} className="p-6 sm:p-8" style={{ background: "var(--color-surface)" }}>
                <div className="flex items-center justify-between mb-5">
                  <input
                    value={p.label}
                    onChange={(e) => update(p.id, { label: e.target.value })}
                    className="bg-transparent outline-none font-display font-semibold"
                    style={{ color: "var(--color-text)", fontSize: "1.05rem" }}
                    aria-label="Property label"
                  />
                  {properties.length > 1 && (
                    <button onClick={() => remove(p.id)} className="text-xs" style={{ color: "var(--color-dim)" }}>Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <NumField label="Value" value={p.value} onChange={(v) => update(p.id, { value: v })} />
                  <NumField label="Loan balance" value={p.loanBalance} onChange={(v) => update(p.id, { loanBalance: v })} />
                  <NumField label="Weekly rent" value={p.weeklyRent} onChange={(v) => update(p.id, { weeklyRent: v })} prefix />
                </div>
                <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t text-xs" style={{ borderColor: "var(--color-line)" }}>
                  <Mini label="Equity" value={formatAUD(pp.equity)} />
                  <Mini label="LVR" value={`${pp.lvr.toFixed(1)}%`} />
                  {p.weeklyRent > 0 && <Mini label="Gross yield" value={`${pp.grossYield.toFixed(1)}%`} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={add}
            className="px-5 py-2.5 text-sm font-medium border transition-colors"
            style={{ borderColor: "var(--color-line-gold)", color: "var(--color-gold)", background: "rgba(194,162,103,0.06)" }}
          >
            + Add a property
          </button>
          {r.annualRent > 0 && (
            <span className="text-sm" style={{ color: "var(--color-muted)" }}>
              Portfolio gross yield <strong style={{ color: "var(--color-text)" }}>{r.grossYield.toFixed(1)}%</strong> · {formatAUD(r.annualRent)}/yr rent
            </span>
          )}
        </div>

        {/* Usable equity callout */}
        <div
          className="reveal mt-12 p-8 sm:p-10 border flex flex-col items-start gap-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-line-gold)" }}
        >
          <p className="eyebrow">Your next move</p>
          <h2 className="display" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--color-text)", maxWidth: "26ch" }}>
            You could access about {formatAUD(r.usableEquity)} in equity.
          </h2>
          <p className="text-sm" style={{ color: "var(--color-muted)", maxWidth: "52ch", lineHeight: 1.6 }}>
            Based on lenders typically releasing up to 80% of value less your current debt. Whether that
            becomes a deposit for the next property depends on serviceability, Akshay can map the path.
          </p>
          <div className="flex flex-wrap gap-5 pt-1">
            <Link to="/tools/pre-buying" className="text-sm font-medium gold-underline pb-px" style={{ color: "var(--color-muted)" }}>
              Test the next purchase →
            </Link>
            <Link to="/contact" className="text-sm font-medium gold-underline pb-px" style={{ color: "var(--color-gold)" }}>
              Plan it with Akshay →
            </Link>
          </div>
        </div>

        <p className="reveal text-xs mt-8" style={{ color: "var(--color-dim)", maxWidth: "66ch", lineHeight: 1.6 }}>
          Usable equity is an indicative figure (80% lending rule) and not a loan offer or financial
          advice. Actual borrowing depends on income, expenses and lender policy.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="p-6 sm:p-7" style={{ background: "var(--color-surface-2)" }}>
      <p className="eyebrow mb-2">{label}</p>
      <p className="font-display font-semibold" style={{ color: accent ? "var(--color-gold)" : "var(--color-text)", fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)", letterSpacing: "-0.01em" }}>
        {value}
      </p>
    </div>
  );
}

function NumField({ label, value, onChange, prefix = false }: { label: string; value: number; onChange: (v: number) => void; prefix?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2.5">{label}</span>
      <div className="flex items-center border px-3" style={{ background: "var(--color-bg)", borderColor: "var(--color-line)" }}>
        <span style={{ color: "var(--color-gold)", marginRight: "0.2rem" }}>$</span>
        <input
          type="text" inputMode="numeric"
          value={value.toLocaleString("en-AU")}
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
            onChange(Number.isFinite(n) ? n : 0);
          }}
          aria-label={label}
          className="w-full bg-transparent outline-none py-2.5 font-display font-semibold"
          style={{ color: "var(--color-text)", fontSize: "1.05rem" }}
        />
        {prefix && <span className="text-xs shrink-0" style={{ color: "var(--color-dim)" }}>/wk</span>}
      </div>
    </label>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ color: "var(--color-dim)" }}>
      {label} <strong className="font-semibold" style={{ color: "var(--color-text)" }}>{value}</strong>
    </span>
  );
}
