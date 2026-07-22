# TOOLS — the broker-grade calculators

All calculators are **deterministic** (same input → same output), show their working,
and cite their source. Every money calculator is verified by the **calc-verifier**
agent against the official source before it ships. Nothing here is a guess.

## Reuse from the V2 website (pure TS — port as-is into `app/core/`)
Located in `Fresh_Build/site-v2/src/lib/` — zero DOM/React deps, drop-in for Expo.

| Tool | Function | Source / status |
|---|---|---|
| Stamp duty (VIC) | `calculateDuty()` in `stampDuty.ts` | SRO VIC tables — **exact**, verified 2026-06-25 |
| Borrowing capacity / deposit / upfront | `assessPreBuying()` in `preBuying.ts` | ATO 2024-25 brackets + APRA 3% buffer — indicative |
| Rental yield / cash-flow | `assessRental()` in `rental.ts` | deterministic |
| Portfolio / equity | `assessPortfolio()` in `portfolio.ts` | 80% lend rule — deterministic |

`preBuying.ts` also exports `incomeTax()`, `netIncome()`, `monthlyRepayment()`, and
`FIXED_COSTS` (conveyancing $1500, building+pest $600, loan setup $600, transfer reg
$1500, mortgage reg $120) — reuse these across the new calculators.

## New calculators to build (deterministic, source-cited)
| Tool | Notes / source |
|---|---|
| Deposit calculator | target deposit vs LVR/LMI trade-off |
| Budget planner | income − commitments → sustainable purchase price |
| Savings tracker | goal + timeline + progress; ties into Stage 1 |
| Grants & concessions | FHOG + VIC stamp-duty concession/exemption — sro.vic.gov.au |
| LMI calculator | LMI premium by LVR band (lender/insurer tables) |
| Offset vs redraw | interest saved comparison |
| Equity calculator | usable equity (80% of value − loan) |
| Cash required at settlement | deposit + duty + fees + adjustments |
| Monthly ownership cost | repayment + rates + water + insurance + owners corp |
| Capital-growth estimator | scenario-based (label clearly as a projection) |
| Renovation-ROI | spend vs uplift (indicative) |
| Loan-comparison engine | compare rate/fees/features across products |
| Investment cash-flow | full pre/post-tax cash-flow (extends `assessRental`) |

## Rules
- **Exact** where the source is exact (stamp duty, grants). **Indicative** where it
  depends on a lender/market (borrowing, LMI, growth, resale) — label every one.
- Show the **formula + source** behind every number ("How we worked this out").
- Money calcs are **VIC-first**; other states become templated rate modules later.
- All new calcs land in `app/core/` as pure TS so the app *and* the website could
  share them.
