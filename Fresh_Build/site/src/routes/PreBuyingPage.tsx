import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InfoHint from "../components/InfoHint";
import { useReveal } from "../lib/useReveal";
import { assessPreBuying, type PreBuyingInput } from "../lib/preBuying";
import { formatAUD, type BuyerType } from "../lib/stampDuty";

/* ------------------------------------------------------------------ *
 *  Pre-buying tool, "Can I afford this?"
 *  Deposit, borrowing power, LMI and the full upfront-cost picture.
 *  Stamp duty is exact (stampDuty.ts); the rest is clearly indicative.
 * ------------------------------------------------------------------ */

const BUYER_OPTIONS: { value: BuyerType; label: string }[] = [
  { value: "fhb", label: "First home buyer" },
  { value: "ppr", label: "Next home" },
  { value: "investor", label: "Investment" },
];

export default function PreBuyingPage() {
  const ref = useReveal(0.06) as React.RefObject<HTMLElement>;

  const [grossIncome, setGrossIncome] = useState(160_000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3_500);
  const [monthlyDebts, setMonthlyDebts] = useState(400);
  const [savings, setSavings] = useState(130_000);
  const [purchasePrice, setPurchasePrice] = useState(650_000);
  const [interestRate, setInterestRate] = useState(6.2);
  const [buyerType, setBuyerType] = useState<BuyerType>("fhb");

  const input: PreBuyingInput = {
    grossIncome,
    monthlyExpenses,
    monthlyDebts,
    savings,
    purchasePrice,
    interestRate: interestRate / 100,
    buyerType,
  };

  const r = useMemo(() => assessPreBuying(input), [grossIncome, monthlyExpenses, monthlyDebts, savings, purchasePrice, interestRate, buyerType]);

  const reportSummary =
    `Inputs — income ${formatAUD(grossIncome)}/yr, living expenses ${formatAUD(monthlyExpenses)}/mo, ` +
    `other debts ${formatAUD(monthlyDebts)}/mo, savings ${formatAUD(savings)}, target price ${formatAUD(purchasePrice)}, ` +
    `rate ${interestRate}%, buyer type ${buyerType}. ` +
    `Results — borrowing power ${formatAUD(r.maxBorrow)}, max purchase ${formatAUD(r.maxPurchase)}, ` +
    `loan required ${formatAUD(r.loanNeeded)}, LVR ${r.lvr.toFixed(1)}%, stamp duty ${formatAUD(r.stampDuty)}, ` +
    `upfront costs ${formatAUD(r.upfrontCosts)}, est. repayment ${formatAUD(r.monthlyRepayment)}/mo.`;

  return (
    <div style={{ background: "var(--color-bg)", paddingTop: "6rem" }}>
      <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-6xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="reveal mb-14 max-w-2xl">
          <p className="eyebrow mb-4">Borrowing capacity · Plan your purchase</p>
          <h1 className="display mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--color-text)" }}>
            Can you actually<br />afford this place?
          </h1>
          <p style={{ color: "var(--color-muted)", maxWidth: "50ch", lineHeight: 1.65 }}>
            Your borrowing power, deposit position and every upfront cost in one view, so you walk
            into an auction knowing your real number, not a guess. Stamp duty is exact; the rest is a
            broker-grade estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px reveal" style={{ background: "var(--color-line)" }}>

          {/* INPUTS */}
          <div className="p-8 sm:p-10 flex flex-col gap-7" style={{ background: "var(--color-surface)" }}>
            <MoneyField label="Combined gross income (yearly)" hint="Total household income before tax, across all buyers." value={grossIncome} onChange={setGrossIncome} step={5_000} />
            <MoneyField label="Living expenses (monthly)" hint="What you typically spend each month to live, excluding debts." value={monthlyExpenses} onChange={setMonthlyExpenses} step={250} />
            <MoneyField label="Other debt repayments (monthly)" hint="Monthly repayments on car loans, personal loans, credit cards, etc." value={monthlyDebts} onChange={setMonthlyDebts} step={100} />
            <MoneyField label="Savings for deposit + costs" hint="Cash you have ready to put toward the deposit and upfront costs." value={savings} onChange={setSavings} step={5_000} />
            <MoneyField label="Target purchase price" hint="The price of the property you're aiming to buy." value={purchasePrice} onChange={setPurchasePrice} step={10_000} />

            {/* Interest rate */}
            <div>
              <PercentField label="Interest rate" hint="The home-loan interest rate you expect to pay." value={interestRate} onChange={setInterestRate} step={0.1} />
              <span className="text-xs block mt-2" style={{ color: "var(--color-dim)" }}>
                Assessed at {(interestRate + 3).toFixed(2)}% (incl. 3% APRA buffer) <InfoHint text="Lenders must check you could still repay if rates rose ~3%, so borrowing power is tested at this higher rate." />
              </span>
            </div>

            {/* Buyer type */}
            <div>
              <span className="eyebrow block mb-3">Buying as</span>
              <div className="flex flex-wrap gap-2">
                {BUYER_OPTIONS.map((o) => {
                  const active = buyerType === o.value;
                  return (
                    <button
                      key={o.value}
                      onClick={() => setBuyerType(o.value)}
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
          </div>

          {/* RESULTS */}
          <div className="p-8 sm:p-10 flex flex-col" style={{ background: "var(--color-surface-2)" }}>

            {/* Verdict */}
            <div
              className="px-5 py-4 mb-8 flex items-start gap-3"
              style={{
                background: r.canService ? "rgba(194,162,103,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${r.canService ? "var(--color-line-gold)" : "var(--color-line)"}`,
              }}
            >
              <span style={{ color: r.canService ? "var(--color-gold)" : "var(--color-dim)", fontSize: "1.1rem", lineHeight: 1 }}>
                {r.canService ? "◆" : "○"}
              </span>
              <p className="text-sm" style={{ color: "var(--color-text)", lineHeight: 1.55 }}>
                {r.canService
                  ? "On these numbers, this purchase looks within reach, your income services the loan and your savings cover the deposit and costs."
                  : r.cashShortfall > 0
                    ? `You'd be about ${formatAUD(r.cashShortfall)} short on cash for the deposit and upfront costs at this price.`
                    : "Your income may not service the loan this price needs. Try a lower price or a larger deposit."}
              </p>
            </div>

            {/* Borrowing power headline */}
            <p className="eyebrow mb-2">Indicative borrowing power <InfoHint text="A rough estimate of the loan amount a lender might offer, based on your income and expenses." /></p>
            <p className="display mb-1" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--color-gold)", letterSpacing: "-0.02em" }}>
              {formatAUD(r.maxBorrow)}
            </p>
            <p className="text-xs mb-8" style={{ color: "var(--color-dim)" }}>
              ≈ up to {formatAUD(r.maxPurchase)} purchase price with your savings · {formatAUD(r.monthlySurplus)}/mo surplus <InfoHint text="Surplus is the income left each month after the loan repayment, living expenses and other debts." />
            </p>

            {/* Breakdown for the target price */}
            <p className="eyebrow mb-4">At {formatAUD(purchasePrice)}</p>
            <div className="flex flex-col gap-3 text-sm">
              <Row label="Deposit (savings after costs)" hint="The cash you put toward the property, what's left of your savings after upfront costs." value={formatAUD(r.depositAmount)} />
              <Row label="Loan required" hint="The amount you'd need to borrow: purchase price minus your deposit." value={formatAUD(r.loanNeeded)} />
              <Row label="Loan-to-value ratio (LVR)" hint="Your loan as a percentage of the property's value. Above 80% usually means extra insurance." value={`${r.lvr.toFixed(1)}%`} accent={r.lvr > 80} />
              {r.lmi > 0 && <Row label="Lenders mortgage insurance (est.)" hint="A one-off insurance premium lenders charge when your deposit is under 20%. It protects them, not you." value={formatAUD(r.lmi)} accent />}
              <Row label="Stamp duty" hint="The one-off state tax on the purchase (calculated exactly from the VIC schedule)." value={formatAUD(r.stampDuty)} />
              <Row label="Upfront costs (duty + fees)" hint="Total cash needed at settlement on top of the deposit: stamp duty plus legal and other fees." value={formatAUD(r.upfrontCosts)} />
            </div>

            <div className="pt-5 mt-5 border-t flex items-center justify-between" style={{ borderColor: "var(--color-line)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Est. repayment <InfoHint text="Estimated monthly mortgage repayment on the loan at your interest rate." /></span>
              <span className="font-display font-semibold" style={{ color: "var(--color-text)", fontSize: "1.2rem" }}>
                {formatAUD(r.monthlyRepayment)}<span className="text-xs font-normal" style={{ color: "var(--color-dim)" }}>/mo</span>
              </span>
            </div>

            {r.lvr > 80 && (
              <p className="text-xs mt-5 leading-relaxed" style={{ color: "var(--color-dim)" }}>
                Above 80% LVR, lenders charge mortgage insurance. A deposit of {formatAUD(purchasePrice * 0.2)} (20%) would avoid it.
              </p>
            )}

            <div className="mt-auto pt-8 flex flex-wrap gap-5">
              <Link to="/tools/stamp-duty" className="text-sm font-medium gold-underline pb-px" style={{ color: "var(--color-muted)" }}>
                ← Stamp duty detail
              </Link>
              <Link to="/contact" className="text-sm font-medium gold-underline pb-px" style={{ color: "var(--color-gold)" }}>
                Speak to a RE representative →
              </Link>
            </div>
          </div>
        </div>

        <ReportRequest summary={reportSummary} />

        <p className="reveal text-xs mt-8" style={{ color: "var(--color-dim)", maxWidth: "70ch", lineHeight: 1.6 }}>
          Borrowing power, LMI and repayments are indicative only, every lender assesses income,
          expenses and serviceability differently, and this is not a loan offer or financial advice. Stamp
          duty follows the current SRO Victoria schedule. Speak to a licensed mortgage broker before committing.
        </p>
      </div>
    </div>
  );
}

/* ---- Email-the-report CTA. Captures the email (+ name) as a lead. ---- */
function ReportRequest({ summary }: { summary: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [format, setFormat] = useState<"PDF" | "HTML">("PDF");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          intent: "report",
          name,
          email,
          message: `Requested a ${format} Borrowing Capacity report. ${summary}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="reveal mt-8 p-6 sm:p-8 border" style={{ background: "var(--color-surface)", borderColor: "var(--color-line-gold)" }}>
      {status === "done" ? (
        <div className="flex items-start gap-3">
          <span style={{ color: "var(--color-gold)", fontSize: "1.1rem", lineHeight: 1 }}>◆</span>
          <p className="text-sm" style={{ color: "var(--color-text)", lineHeight: 1.55 }}>
            Thanks {name.split(" ")[0] || "there"} — your {format} report is on its way to <span style={{ color: "var(--color-gold)" }}>{email}</span>.
          </p>
        </div>
      ) : !open ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-display font-semibold" style={{ color: "var(--color-text)", fontSize: "1.15rem" }}>
              Want this as a report?
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
              Get your full borrowing summary as a PDF or HTML, straight to your inbox.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors duration-200"
            style={{ background: "var(--color-gold)", color: "var(--color-bg)", letterSpacing: "0.04em" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold-bright)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
          >
            Email me my report
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="font-display font-semibold mb-4" style={{ color: "var(--color-text)", fontSize: "1.15rem" }}>
            Where should we send it?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 text-sm bg-transparent border outline-none"
              style={{ borderColor: "var(--color-line)", color: "var(--color-text)" }}
            />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 text-sm bg-transparent border outline-none"
              style={{ borderColor: "var(--color-line)", color: "var(--color-text)" }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="eyebrow">Format</span>
            {(["PDF", "HTML"] as const).map((f) => (
              <button
                key={f} type="button" onClick={() => setFormat(f)}
                className="px-4 py-2 text-xs font-semibold border transition-colors"
                style={{
                  borderColor: format === f ? "var(--color-gold)" : "var(--color-line)",
                  color: format === f ? "var(--color-gold)" : "var(--color-muted)",
                  background: format === f ? "rgba(194,162,103,0.08)" : "transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          {status === "error" && (
            <p className="text-xs mb-3" style={{ color: "#e2776b" }}>{err}</p>
          )}
          <div className="flex items-center gap-4">
            <button
              type="submit" disabled={status === "sending"}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors duration-200"
              style={{ background: "var(--color-gold)", color: "var(--color-bg)", letterSpacing: "0.04em", opacity: status === "sending" ? 0.6 : 1 }}
            >
              {status === "sending" ? "Sending…" : "Send me the report"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm gold-underline pb-px" style={{ color: "var(--color-muted)" }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---- Small field with stepper buttons ---- */
function MoneyField({ label, value, onChange, step, hint }: { label: string; value: number; onChange: (n: number) => void; step: number; hint?: string }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-3">{label}{hint && <> <InfoHint text={hint} /></>}</span>
      <div className="flex items-center border" style={{ background: "var(--color-bg)", borderColor: "var(--color-line)" }}>
        <Stepper sign="−" onClick={() => onChange(Math.max(0, value - step))} />
        <div className="flex-1 flex items-center justify-center px-2">
          <span style={{ color: "var(--color-gold)", marginRight: "0.25rem" }}>$</span>
          <input
            type="text"
            inputMode="numeric"
            value={value.toLocaleString("en-AU")}
            onChange={(e) => {
              const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
              onChange(Number.isFinite(n) ? n : 0);
            }}
            aria-label={label}
            className="w-full bg-transparent outline-none text-center font-display"
            style={{ color: "var(--color-text)", fontSize: "1.25rem", fontWeight: 600 }}
          />
        </div>
        <Stepper sign="+" onClick={() => onChange(value + step)} />
      </div>
    </label>
  );
}

function PercentField({ label, value, onChange, step, hint }: { label: string; value: number; onChange: (n: number) => void; step: number; hint?: string }) {
  const [text, setText] = useState(value.toString());
  useEffect(() => { setText(value.toString()); }, [value]);
  return (
    <label className="block">
      <span className="eyebrow block mb-3">{label}{hint && <> <InfoHint text={hint} /></>}</span>
      <div className="flex items-center border" style={{ background: "var(--color-bg)", borderColor: "var(--color-line)" }}>
        <Stepper sign="−" onClick={() => onChange(Math.max(0, +(value - step).toFixed(2)))} />
        <div className="flex-1 flex items-center justify-center px-2">
          <input
            type="text"
            inputMode="decimal"
            value={text}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, "");
              setText(raw);
              const n = parseFloat(raw);
              if (Number.isFinite(n)) onChange(n);
            }}
            aria-label={label}
            className="w-full bg-transparent outline-none text-center font-display"
            style={{ color: "var(--color-text)", fontSize: "1.25rem", fontWeight: 600 }}
          />
          <span style={{ color: "var(--color-gold)", marginLeft: "0.25rem" }}>%</span>
        </div>
        <Stepper sign="+" onClick={() => onChange(+(value + step).toFixed(2))} />
      </div>
    </label>
  );
}

function Stepper({ sign, onClick }: { sign: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={sign === "+" ? "Increase" : "Decrease"}
      className="px-4 py-3 text-lg transition-colors shrink-0"
      style={{ color: "var(--color-muted)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
    >
      {sign}
    </button>
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
