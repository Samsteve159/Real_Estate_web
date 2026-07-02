/* ================================================================== *
 *  VIC Land Transfer (Stamp) Duty, deterministic engine
 *
 *  Source of truth: State Revenue Office Victoria (sro.vic.gov.au).
 *  All figures cross-checked against the SRO rate tables fetched
 *  2026-06-25. This module contains NO estimation, every output is
 *  a direct calculation from the published legislative schedule.
 *
 *  Verified anchors:
 *    • General rate, $600,000 dutiable value  → $31,070   (matches the
 *      Manifest property-stats spreadsheet to the dollar)
 *    • PPR rate,     $500,000 dutiable value  → $21,970
 *    • FHB,          ≤ $600,000               → $0 (full exemption)
 *    • FHB,          $650,000                 → $11,356.67 (phase-in)
 *
 *  Schedule references:
 *    • General (non-PPR): /non-principal-place-residence-dutiable-property-current-rates
 *      (contracts on/after 1 July 2021)
 *    • PPR:               /principal-place-residence-current-rates
 *      (contracts on/after 6 May 2008)
 *    • First home buyer:  /fhbduty
 *    • Foreign purchaser additional duty: 8% of dutiable value (current rate)
 * ================================================================== */

export interface DutyBracket {
  /** Lower bound of the band (exclusive above this value, except the first band). */
  min: number;
  /** Upper bound of the band (inclusive). null = no upper bound. */
  max: number | null;
  /** Fixed duty applied at the start of the band. */
  base: number;
  /** Marginal rate applied to the excess over `over`. */
  rate: number;
  /** The value the marginal rate is charged in excess of. */
  over: number;
  /**
   * If set, the whole band is a flat percentage of the *entire* dutiable
   * value (not marginal). Used for the $960k–$2m general band (5.5% flat).
   */
  flatOfTotal?: number;
}

/* ---- General / non-PPR rates (contracts on/after 1 July 2021) ---- */
export const GENERAL_BRACKETS: DutyBracket[] = [
  { min: 0,         max: 25_000,    base: 0,       rate: 0.014, over: 0 },
  { min: 25_000,    max: 130_000,   base: 350,     rate: 0.024, over: 25_000 },
  { min: 130_000,   max: 960_000,   base: 2_870,   rate: 0.06,  over: 130_000 },
  { min: 960_000,   max: 2_000_000, base: 0,       rate: 0,     over: 0, flatOfTotal: 0.055 },
  { min: 2_000_000, max: null,      base: 110_000, rate: 0.065, over: 2_000_000 },
];

/* ---- Principal place of residence rates (contracts on/after 6 May 2008) ---- *
 * Only applies for dutiable value up to $550,000. Above that, the general
 * schedule applies.                                                            */
export const PPR_BRACKETS: DutyBracket[] = [
  { min: 0,       max: 25_000,  base: 0,      rate: 0.014, over: 0 },
  { min: 25_000,  max: 130_000, base: 350,    rate: 0.024, over: 25_000 },
  { min: 130_000, max: 440_000, base: 2_870,  rate: 0.05,  over: 130_000 },
  { min: 440_000, max: 550_000, base: 18_370, rate: 0.06,  over: 440_000 },
];

const PPR_CEILING = 550_000;

/* FHB thresholds */
const FHB_EXEMPT_CEILING = 600_000;   // ≤ this → $0
const FHB_CONCESSION_CEILING = 750_000; // ≤ this (and > exempt) → phase-in

/* Foreign purchaser additional duty (current rate). */
export const FOREIGN_DUTY_RATE = 0.08;

/** Apply a marginal-bracket schedule to a dutiable value. */
function applyBrackets(value: number, brackets: DutyBracket[]): number {
  if (value <= 0) return 0;
  for (const b of brackets) {
    const withinBand = b.max === null ? value > b.min : value > b.min && value <= b.max;
    if (withinBand) {
      if (b.flatOfTotal !== undefined) return value * b.flatOfTotal;
      return b.base + (value - b.over) * b.rate;
    }
  }
  // Value below the first band's min (i.e. exactly 0 handled above), fall through.
  return 0;
}

/** Raw general (non-PPR) land transfer duty. */
export function generalDuty(dutiableValue: number): number {
  return applyBrackets(dutiableValue, GENERAL_BRACKETS);
}

/** Raw PPR-concessional duty. Falls back to general above $550,000. */
export function pprDuty(dutiableValue: number): number {
  if (dutiableValue > PPR_CEILING) return generalDuty(dutiableValue);
  return applyBrackets(dutiableValue, PPR_BRACKETS);
}

export type BuyerType = "fhb" | "ppr" | "investor";

export interface DutyInput {
  dutiableValue: number;
  buyerType: BuyerType;
  /** Foreign purchaser additional duty applies (8% of dutiable value). */
  foreignPurchaser?: boolean;
}

export interface DutyResult {
  dutiableValue: number;
  buyerType: BuyerType;
  /** Base duty before any FHB concession, as a reference point. */
  generalDuty: number;
  /** Duty payable under the applicable schedule/concession. */
  duty: number;
  /** Foreign purchaser additional duty (0 if not applicable). */
  foreignDuty: number;
  /** duty + foreignDuty, what actually leaves the bank account. */
  totalPayable: number;
  /** How much the buyer saved vs the general rate (FHB / PPR concession). */
  saving: number;
  /** Human-readable note on which rule applied. */
  basis: string;
}

/**
 * The single entry point. Deterministic, same input always yields the
 * same output, computed directly from the SRO schedule.
 */
export function calculateDuty({ dutiableValue, buyerType, foreignPurchaser = false }: DutyInput): DutyResult {
  const value = Math.max(0, Math.round(dutiableValue));
  const general = generalDuty(value);

  let duty: number;
  let basis: string;

  if (buyerType === "fhb") {
    if (value <= FHB_EXEMPT_CEILING) {
      duty = 0;
      basis = "First home buyer exemption, no duty payable on homes up to $600,000.";
    } else if (value <= FHB_CONCESSION_CEILING) {
      // SRO phase-in: full duty tapers in linearly from $600,001 to $750,000.
      const factor = (value - FHB_EXEMPT_CEILING) / (FHB_CONCESSION_CEILING - FHB_EXEMPT_CEILING);
      duty = general * factor;
      basis = "First home buyer concession, duty phases in between $600,001 and $750,000.";
    } else {
      duty = general;
      basis = "No first home buyer benefit, dutiable value is above the $750,000 threshold.";
    }
  } else if (buyerType === "ppr") {
    duty = pprDuty(value);
    basis = value <= PPR_CEILING
      ? "Principal place of residence concessional rate (homes $130,000–$550,000)."
      : "General rate, the PPR concession only applies up to $550,000.";
  } else {
    duty = general;
    basis = "General land transfer duty rate (investor / non-PPR).";
  }

  const foreignDuty = foreignPurchaser ? value * FOREIGN_DUTY_RATE : 0;

  return {
    dutiableValue: value,
    buyerType,
    generalDuty: round2(general),
    duty: round2(duty),
    foreignDuty: round2(foreignDuty),
    totalPayable: round2(duty + foreignDuty),
    saving: round2(Math.max(0, general - duty)),
    basis,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatAUD(n: number, withCents = false): string {
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  });
}
