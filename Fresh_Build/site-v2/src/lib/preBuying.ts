/* ================================================================== *
 *  Pre-buying tool, deposit, borrowing capacity & upfront costs
 *
 *  Anchored by the deterministic VIC stamp-duty engine (stampDuty.ts).
 *  Stamp duty is exact; borrowing capacity and LMI are clearly-labelled
 *  INDICATIVE estimates, lenders and insurers use private serviceability
 *  models and LMI premium tables we can't reproduce exactly.
 *
 *  Tax brackets: ATO resident rates 2024–25 (Stage 3) + 2% Medicare levy.
 *  APRA serviceability buffer: +3.00% on the assessed loan rate.
 * ================================================================== */

import { calculateDuty, type BuyerType } from "./stampDuty";

/* ---- Australian resident income tax (2024–25) ---- */
const TAX_BRACKETS = [
  { over: 0,       base: 0,      rate: 0 },
  { over: 18_200,  base: 0,      rate: 0.16 },
  { over: 45_000,  base: 4_288,  rate: 0.30 },
  { over: 135_000, base: 31_288, rate: 0.37 },
  { over: 190_000, base: 51_638, rate: 0.45 },
];
const MEDICARE_LEVY = 0.02;

/** Annual income tax + Medicare levy for an AU resident. */
export function incomeTax(gross: number): number {
  if (gross <= 0) return 0;
  let bracket = TAX_BRACKETS[0];
  for (const b of TAX_BRACKETS) if (gross > b.over) bracket = b;
  const tax = bracket.base + (gross - bracket.over) * bracket.rate;
  const medicare = gross > 26_000 ? gross * MEDICARE_LEVY : 0; // simplified threshold
  return tax + medicare;
}

/** After-tax annual income. */
export function netIncome(gross: number): number {
  return Math.max(0, gross - incomeTax(gross));
}

/* ---- LMI: indicative premium as % of loan, by LVR band ---- *
 * Real LMI comes from insurer tables (Helia/QBE) and varies by lender.
 * These are mid-market indicative rates for owner-occupiers.            */
function lmiRate(lvr: number): number {
  if (lvr <= 0.80) return 0;
  if (lvr <= 0.85) return 0.006;
  if (lvr <= 0.90) return 0.015;
  if (lvr <= 0.95) return 0.030;
  return 0.039; // above 95% LVR most lenders decline, shown as a worst-case
}

/* ---- Indicative fixed upfront costs (VIC, 2026) ---- */
export const FIXED_COSTS = {
  conveyancing: 1_500,
  buildingPest: 600,
  loanSetup: 600,
  transferRegistration: 1_500, // Land Use Victoria transfer fee (scales; indicative)
  mortgageRegistration: 120,
};

const APRA_BUFFER = 0.03;
const LOAN_TERM_MONTHS = 30 * 12;

/** Monthly principal & interest repayment for a loan. */
export function monthlyRepayment(principal: number, annualRate: number, months = LOAN_TERM_MONTHS): number {
  if (principal <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/** Present value of a monthly payment stream, used to invert repayment → max loan. */
function maxLoanFromRepayment(monthly: number, annualRate: number, months = LOAN_TERM_MONTHS): number {
  if (monthly <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return monthly * months;
  return (monthly * (1 - Math.pow(1 + r, -months))) / r;
}

export interface PreBuyingInput {
  /** Combined gross annual income (household). */
  grossIncome: number;
  /** Total monthly living expenses. */
  monthlyExpenses: number;
  /** Total monthly repayments on existing debts (loans, card minimums). */
  monthlyDebts: number;
  /** Cash saved for deposit + costs. */
  savings: number;
  /** Target purchase price. */
  purchasePrice: number;
  /** Loan interest rate (e.g. 0.062 for 6.2%). */
  interestRate: number;
  buyerType: BuyerType;
}

export interface PreBuyingResult {
  netMonthlyIncome: number;
  /** Monthly surplus available to service a loan. */
  monthlySurplus: number;
  /** Indicative maximum loan (surplus serviced at rate + APRA buffer). */
  maxBorrow: number;
  /** Indicative maximum purchase price = maxBorrow + savings (less buffer for costs). */
  maxPurchase: number;

  /* For the target purchase price: */
  stampDuty: number;
  upfrontCosts: number; // stamp duty + fixed costs (excl. LMI)
  loanNeeded: number;   // price − (savings − upfrontCosts)
  depositAmount: number; // savings applied to the property after costs
  lvr: number;
  lmi: number;
  monthlyRepayment: number;
  /** Does serviceability cover the needed loan, and savings cover deposit+costs? */
  canService: boolean;
  cashShortfall: number; // >0 means savings don't cover deposit + costs + LMI
}

export function assessPreBuying(input: PreBuyingInput): PreBuyingResult {
  const { grossIncome, monthlyExpenses, monthlyDebts, savings, purchasePrice, interestRate, buyerType } = input;

  const net = netIncome(grossIncome);
  const netMonthlyIncome = net / 12;
  const monthlySurplus = Math.max(0, netMonthlyIncome - monthlyExpenses - monthlyDebts);

  const assessRate = interestRate + APRA_BUFFER;
  const maxBorrow = maxLoanFromRepayment(monthlySurplus, assessRate);

  // Stamp duty + fixed costs for the target price.
  const duty = calculateDuty({ dutiableValue: purchasePrice, buyerType }).duty;
  const fixed = Object.values(FIXED_COSTS).reduce((a, b) => a + b, 0);
  const upfrontCosts = duty + fixed;

  // Savings first cover upfront costs, the remainder is the deposit.
  const depositAmount = Math.max(0, savings - upfrontCosts);
  const loanNeeded = Math.max(0, purchasePrice - depositAmount);
  const lvr = purchasePrice > 0 ? loanNeeded / purchasePrice : 0;
  const lmi = loanNeeded * lmiRate(lvr);

  // Cash must cover upfront costs + LMI + at least the deposit gap.
  const cashNeeded = upfrontCosts + lmi + Math.max(0, purchasePrice - loanNeeded);
  const cashShortfall = Math.max(0, cashNeeded - savings);

  const repay = monthlyRepayment(loanNeeded + lmi, interestRate); // LMI usually capitalised
  const canService = loanNeeded <= maxBorrow && cashShortfall <= 0;

  // Indicative max purchase: borrowing power + usable savings, holding ~6% back for costs.
  const usableSavings = Math.max(0, savings - fixed);
  const maxPurchase = (maxBorrow + usableSavings) / 1.06;

  return {
    netMonthlyIncome: round2(netMonthlyIncome),
    monthlySurplus: round2(monthlySurplus),
    maxBorrow: round0(maxBorrow),
    maxPurchase: round0(maxPurchase),
    stampDuty: round0(duty),
    upfrontCosts: round0(upfrontCosts),
    loanNeeded: round0(loanNeeded),
    depositAmount: round0(depositAmount),
    lvr: Math.round(lvr * 1000) / 10, // percent, 1dp
    lmi: round0(lmi),
    monthlyRepayment: round0(repay),
    canService,
    cashShortfall: round0(cashShortfall),
  };
}

const round0 = (n: number) => Math.round(n);
const round2 = (n: number) => Math.round(n * 100) / 100;
