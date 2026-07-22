/* ================================================================== *
 *  Rental tool, deterministic yield & cash-flow maths.
 *
 *  For early investors and first-home buyers weighing a rental:
 *  gross yield, net yield, and annual / weekly cash flow (positive vs
 *  negative gearing). Loan interest is on an interest-only basis, the
 *  standard lens for a yield comparison; clearly labelled indicative.
 * ================================================================== */

export interface RentalInput {
  purchasePrice: number;
  weeklyRent: number;
  loanAmount: number;
  interestRate: number;     // e.g. 0.062 for 6.2%
  councilRates: number;     // annual
  insurance: number;        // annual
  maintenance: number;      // annual
  strata: number;           // annual body corporate / owners corp
  managementPct: number;    // e.g. 0.066 (6.6% of rent), 0 for self-managed
  vacancyWeeks: number;     // weeks/yr assumed vacant
}

export interface RentalResult {
  annualRent: number;            // effective, after vacancy
  grossAnnualRent: number;       // before vacancy
  grossYield: number;            // % of purchase price, 1dp
  operatingExpenses: number;     // excl. loan interest
  managementFee: number;
  netOperatingIncome: number;    // rent - operating expenses
  netYield: number;              // NOI / price, % 1dp
  loanInterest: number;          // annual, interest-only basis
  annualCashflow: number;        // NOI - loan interest
  weeklyCashflow: number;
  geared: "positive" | "neutral" | "negative";
}

export function assessRental(input: RentalInput): RentalResult {
  const {
    purchasePrice, weeklyRent, loanAmount, interestRate,
    councilRates, insurance, maintenance, strata, managementPct, vacancyWeeks,
  } = input;

  const grossAnnualRent = weeklyRent * 52;
  const occupiedWeeks = Math.max(0, 52 - vacancyWeeks);
  const annualRent = weeklyRent * occupiedWeeks;

  const managementFee = annualRent * managementPct;
  const operatingExpenses = councilRates + insurance + maintenance + strata + managementFee;
  const netOperatingIncome = annualRent - operatingExpenses;

  const loanInterest = Math.max(0, loanAmount) * interestRate;
  const annualCashflow = netOperatingIncome - loanInterest;

  const grossYield = purchasePrice > 0 ? (grossAnnualRent / purchasePrice) * 100 : 0;
  const netYield = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;

  const geared: RentalResult["geared"] =
    annualCashflow > 50 ? "positive" : annualCashflow < -50 ? "negative" : "neutral";

  return {
    annualRent: round0(annualRent),
    grossAnnualRent: round0(grossAnnualRent),
    grossYield: round1(grossYield),
    operatingExpenses: round0(operatingExpenses),
    managementFee: round0(managementFee),
    netOperatingIncome: round0(netOperatingIncome),
    netYield: round1(netYield),
    loanInterest: round0(loanInterest),
    annualCashflow: round0(annualCashflow),
    weeklyCashflow: round0(annualCashflow / 52),
    geared,
  };
}

const round0 = (n: number) => Math.round(n);
const round1 = (n: number) => Math.round(n * 10) / 10;
