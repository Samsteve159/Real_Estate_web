/* ================================================================== *
 *  Portfolio assessment, deterministic equity & leverage maths.
 *
 *  Aimed at 1–2-property owners / early investors: total value, debt,
 *  equity, LVR, usable equity for the next purchase, and gross yield.
 *  No estimates beyond the standard 80%-lend rule (clearly labelled).
 * ================================================================== */

export interface Property {
  id: string;
  label: string;
  value: number;        // current estimated value
  loanBalance: number;  // outstanding mortgage
  weeklyRent: number;   // 0 for owner-occupied
}

export interface PortfolioResult {
  totalValue: number;
  totalDebt: number;
  totalEquity: number;
  portfolioLVR: number;       // percent, 1dp
  /** Equity a lender will typically release: 80% of value − current debt. */
  usableEquity: number;
  annualRent: number;
  grossYield: number;         // percent of total value, 1dp
  perProperty: {
    id: string;
    label: string;
    equity: number;
    lvr: number;              // percent, 1dp
    grossYield: number;       // percent, 1dp (0 if owner-occupied)
  }[];
}

/** Banks typically lend against 80% of a property's value. */
const LEND_RATIO = 0.80;

export function assessPortfolio(properties: Property[]): PortfolioResult {
  const totalValue = sum(properties.map((p) => p.value));
  const totalDebt = sum(properties.map((p) => p.loanBalance));
  const totalEquity = totalValue - totalDebt;
  const annualRent = sum(properties.map((p) => p.weeklyRent * 52));

  const usableEquity = Math.max(0, LEND_RATIO * totalValue - totalDebt);
  const portfolioLVR = totalValue > 0 ? (totalDebt / totalValue) * 100 : 0;
  const grossYield = totalValue > 0 ? (annualRent / totalValue) * 100 : 0;

  const perProperty = properties.map((p) => ({
    id: p.id,
    label: p.label,
    equity: p.value - p.loanBalance,
    lvr: p.value > 0 ? round1((p.loanBalance / p.value) * 100) : 0,
    grossYield: p.value > 0 ? round1(((p.weeklyRent * 52) / p.value) * 100) : 0,
  }));

  return {
    totalValue: Math.round(totalValue),
    totalDebt: Math.round(totalDebt),
    totalEquity: Math.round(totalEquity),
    portfolioLVR: round1(portfolioLVR),
    usableEquity: Math.round(usableEquity),
    annualRent: Math.round(annualRent),
    grossYield: round1(grossYield),
    perProperty,
  };
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const round1 = (n: number) => Math.round(n * 10) / 10;
