import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InfoHint from "../components/InfoHint";
import { useReveal } from "../lib/useReveal";
import { assessRental, type RentalInput } from "../lib/rental";
import { formatAUD } from "../lib/stampDuty";

/* ------------------------------------------------------------------ *
 *  Rental tool, gross/net yield and weekly cash flow.
 *  Deterministic (rental.ts). No API.
 * ------------------------------------------------------------------ */

const GEARING_COPY: Record<string, { label: string; color: string }> = {
  positive: { label: "Positively geared", color: "var(--color-gold)" },
  neutral: { label: "Roughly neutral", color: "var(--color-gold-dim)" },
  negative: { label: "Negatively geared", color: "var(--color-muted)" },
};

export default function RentalPage() {
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;

  const [purchasePrice, setPurchasePrice] = useState(650_000);
  const [weeklyRent, setWeeklyRent] = useState(520);
  const [loanAmount, setLoanAmount] = useState(500_000);
  const [interestRate, setInterestRate] = useState(6.2);
  const [councilRates, setCouncilRates] = useState(1_800);
  const [insurance, setInsurance] = useState(1_200);
  const [maintenance, setMaintenance] = useState(1_500);
  const [strata, setStrata] = useState(0);
  const [managementPct, setManagementPct] = useState(6.6);
  const [vacancyWeeks, setVacancyWeeks] = useState(2);

  const input: RentalInput = {
    purchasePrice, weeklyRent, loanAmount,
    interestRate: interestRate / 100,
    councilRates, insurance, maintenance, strata,
    managementPct: managementPct / 100,
    vacancyWeeks,
  };

  const r = useMemo(() => assessRental(input), [purchasePrice, weeklyRent, loanAmount, interestRate, councilRates, insurance, maintenance, strata, managementPct, vacancyWeeks]);
  const gearing = GEARING_COPY[r.geared];

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "9rem" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-6xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="reveal mb-14 max-w-2xl">
          <p className="eyebrow mb-4">Rental · Yield & cash flow</p>
          <h1 className="display mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--color-text)" }}>
            Will it pay<br />for itself?
          </h1>
          <p style={{ color: "var(--color-muted)", maxWidth: "50ch", lineHeight: 1.65 }}>
            Gross and net rental yield, plus what the property actually costs or earns you each week
            once the mortgage and running costs are in. Know before you buy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px reveal" style={{ background: "var(--color-line)" }}>

          {/* INPUTS */}
          <div className="p-8 sm:p-10 flex flex-col gap-6" style={{ background: "var(--color-surface)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <MoneyField label="Purchase price" hint="What you're paying for the property." value={purchasePrice} onChange={setPurchasePrice} step={10_000} />
              <MoneyField label="Weekly rent" hint="Rent the tenant pays each week." value={weeklyRent} onChange={setWeeklyRent} step={10} suffix="/wk" />
              <MoneyField label="Loan amount" hint="How much of the price you're borrowing." value={loanAmount} onChange={setLoanAmount} step={10_000} />
              <PctField label="Interest rate" hint="Your loan's annual interest rate." value={interestRate} onChange={setInterestRate} step={0.1} />
            </div>

            <div className="pt-2">
              <p className="eyebrow mb-4">Annual running costs</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <MoneyField label="Council rates" hint="Yearly charge from the local council." value={councilRates} onChange={setCouncilRates} step={100} />
                <MoneyField label="Insurance" hint="Yearly building and landlord insurance cost." value={insurance} onChange={setInsurance} step={100} />
                <MoneyField label="Maintenance" hint="What you set aside each year for repairs and upkeep." value={maintenance} onChange={setMaintenance} step={100} />
                <MoneyField label="Body corporate" hint="Yearly fees for shared upkeep in units and townhouses (also called strata or owners' corporation)." value={strata} onChange={setStrata} step={100} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <PctField label="Management fee" hint="What a property manager charges to run the rental, as a % of the rent." value={managementPct} onChange={setManagementPct} step={0.1} />
              <NumPlainField label="Vacancy (weeks/yr)" hint="Weeks per year you assume the place sits empty between tenants." value={vacancyWeeks} onChange={setVacancyWeeks} step={1} />
            </div>
          </div>

          {/* RESULTS */}
          <div className="p-8 sm:p-10 flex flex-col" style={{ background: "var(--color-surface-2)" }}>
            <div className="grid grid-cols-2 gap-px mb-8" style={{ background: "var(--color-line)" }}>
              <Stat label="Gross yield" hint="Yearly rent as a % of the price, before any costs." value={`${r.grossYield.toFixed(1)}%`} />
              <Stat label="Net yield" hint="Yearly rent after running costs, as a % of the price." value={`${r.netYield.toFixed(1)}%`} accent />
            </div>

            <p className="eyebrow mb-2">Weekly cash flow <InfoHint text="What the property puts in your pocket (+) or costs you (−) each week, after the loan and bills." /></p>
            <p className="display mb-1" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: r.weeklyCashflow >= 0 ? "var(--color-gold)" : "var(--color-text)", letterSpacing: "-0.02em" }}>
              {r.weeklyCashflow >= 0 ? "+" : "−"}{formatAUD(Math.abs(r.weeklyCashflow))}<span className="text-sm font-normal" style={{ color: "var(--color-dim)" }}>/wk</span>
            </p>
            <p className="text-xs mb-8" style={{ color: gearing.color }}>{gearing.label} <InfoHint text="Whether the property earns more than it costs (positively geared) or costs more than it earns (negatively geared)." /></p>

            <div className="flex flex-col gap-3 text-sm">
              <Row label="Rent (after vacancy)" hint="Yearly rent, reduced for the weeks you assume it's empty." value={`${formatAUD(r.annualRent)}/yr`} />
              <Row label="Operating expenses" hint="Total yearly running costs: rates, insurance, maintenance and body corporate." value={`− ${formatAUD(r.operatingExpenses)}/yr`} />
              <Row label="Management fee" hint="Yearly cost of the property manager." value={`− ${formatAUD(r.managementFee)}/yr`} />
              <Row label="Net operating income" hint="Rent left each year after running and management costs, before the loan." value={`${formatAUD(r.netOperatingIncome)}/yr`} accent />
              <Row label="Loan interest (interest-only)" hint="Yearly interest on the loan, assuming you pay interest only (no principal)." value={`− ${formatAUD(r.loanInterest)}/yr`} />
            </div>

            <div className="pt-5 mt-5 border-t flex items-center justify-between" style={{ borderColor: "var(--color-line)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Annual cash flow <InfoHint text="Your total yearly gain (+) or shortfall (−) after everything." /></span>
              <span className="font-display font-semibold" style={{ color: r.annualCashflow >= 0 ? "var(--color-gold)" : "var(--color-text)", fontSize: "1.2rem" }}>
                {r.annualCashflow >= 0 ? "+" : "−"}{formatAUD(Math.abs(r.annualCashflow))}
              </span>
            </div>

            <div className="mt-auto pt-8 flex flex-wrap gap-5">
              <Link to="/tools/pre-buying" className="text-sm font-medium gold-underline pb-px" style={{ color: "var(--color-muted)" }}>
                ← Check what you can borrow
              </Link>
              <Link to="/contact" className="text-sm font-medium gold-underline pb-px" style={{ color: "var(--color-gold)" }}>
                Talk strategy with AK →
              </Link>
            </div>
          </div>
        </div>

        <p className="reveal text-xs mt-8" style={{ color: "var(--color-dim)", maxWidth: "70ch", lineHeight: 1.6 }}>
          Yields and cash flow are indicative only and not financial or tax advice. Loan interest is
          shown on an interest-only basis and excludes depreciation, tax effects and one-off costs.
          Speak to AK and your accountant before investing.
        </p>
      </div>
    </div>
  );
}

/* ---- fields ---- */
function Stat({ label, value, hint, accent = false }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className="p-5" style={{ background: "var(--color-surface)" }}>
      <p className="eyebrow mb-2">{label}{hint && <> <InfoHint text={hint} /></>}</p>
      <p className="font-display font-semibold" style={{ color: accent ? "var(--color-gold)" : "var(--color-text)", fontSize: "1.7rem", letterSpacing: "-0.01em" }}>{value}</p>
    </div>
  );
}

function MoneyField({ label, value, onChange, step, suffix, hint }: { label: string; value: number; onChange: (n: number) => void; step: number; suffix?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2.5">{label}{hint && <> <InfoHint text={hint} /></>}</span>
      <div className="flex items-center border" style={{ background: "var(--color-bg)", borderColor: "var(--color-line)" }}>
        <button type="button" onClick={() => onChange(Math.max(0, value - step))} className="px-3 py-2.5 text-lg shrink-0" style={{ color: "var(--color-muted)" }} aria-label="Decrease">−</button>
        <div className="flex-1 flex items-center justify-center">
          <span style={{ color: "var(--color-gold)", marginRight: "0.2rem" }}>$</span>
          <input
            type="text" inputMode="numeric"
            value={value.toLocaleString("en-AU")}
            onChange={(e) => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); onChange(Number.isFinite(n) ? n : 0); }}
            aria-label={label}
            className="w-full bg-transparent outline-none py-2.5 text-center font-display font-semibold"
            style={{ color: "var(--color-text)", fontSize: "1.05rem" }}
          />
          {suffix && <span className="text-xs shrink-0 pr-1" style={{ color: "var(--color-dim)" }}>{suffix}</span>}
        </div>
        <button type="button" onClick={() => onChange(value + step)} className="px-3 py-2.5 text-lg shrink-0" style={{ color: "var(--color-muted)" }} aria-label="Increase">+</button>
      </div>
    </label>
  );
}

function PctField({ label, value, onChange, step, hint }: { label: string; value: number; onChange: (n: number) => void; step: number; hint?: string }) {
  const [text, setText] = useState(value.toString());
  useEffect(() => { setText(value.toString()); }, [value]);
  return (
    <label className="block">
      <span className="eyebrow block mb-2.5">{label}{hint && <> <InfoHint text={hint} /></>}</span>
      <div className="flex items-center border" style={{ background: "var(--color-bg)", borderColor: "var(--color-line)" }}>
        <button type="button" onClick={() => onChange(Math.max(0, +(value - step).toFixed(2)))} className="px-3 py-2.5 text-lg shrink-0" style={{ color: "var(--color-muted)" }} aria-label="Decrease">−</button>
        <div className="flex-1 flex items-center justify-center">
          <input
            type="text" inputMode="decimal"
            value={text}
            onChange={(e) => { const raw = e.target.value.replace(/[^0-9.]/g, ""); setText(raw); const n = parseFloat(raw); if (Number.isFinite(n)) onChange(n); }}
            aria-label={label}
            className="w-full bg-transparent outline-none py-2.5 text-center font-display font-semibold"
            style={{ color: "var(--color-text)", fontSize: "1.05rem" }}
          />
          <span className="text-xs shrink-0 pr-1" style={{ color: "var(--color-gold)" }}>%</span>
        </div>
        <button type="button" onClick={() => onChange(+(value + step).toFixed(2))} className="px-3 py-2.5 text-lg shrink-0" style={{ color: "var(--color-muted)" }} aria-label="Increase">+</button>
      </div>
    </label>
  );
}

function NumPlainField({ label, value, onChange, step, hint }: { label: string; value: number; onChange: (n: number) => void; step: number; hint?: string }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2.5">{label}{hint && <> <InfoHint text={hint} /></>}</span>
      <div className="flex items-center border" style={{ background: "var(--color-bg)", borderColor: "var(--color-line)" }}>
        <button type="button" onClick={() => onChange(Math.max(0, value - step))} className="px-4 py-2.5 text-lg" style={{ color: "var(--color-muted)" }} aria-label="Decrease">−</button>
        <span className="flex-1 text-center font-display font-semibold" style={{ color: "var(--color-text)" }}>{value}</span>
        <button type="button" onClick={() => onChange(value + step)} className="px-4 py-2.5 text-lg" style={{ color: "var(--color-muted)" }} aria-label="Increase">+</button>
      </div>
    </label>
  );
}

function Row({ label, value, hint, accent = false }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: "var(--color-muted)" }}>{label}{hint && <> <InfoHint text={hint} /></>}</span>
      <span className="font-medium" style={{ color: accent ? "var(--color-gold)" : "var(--color-text)" }}>{value}</span>
    </div>
  );
}
