/* ================================================================== *
 *  Shared domain / API types
 *
 *  The contract between the buyer app and the Manifest `api/` backend.
 *  Mirrors `Fresh_Build/site-v2/src/lib/api.ts` so the app and website
 *  speak the same shapes. Pure types — no runtime, no deps.
 * ================================================================== */

/* ---- Suburbs ---- */
export interface Suburb {
  name: string;
  postcode: string;
  medianHouse: number;
  medianUnit: number;
  trend12mo: number;
  blurb: string;
  lifestyle: string;
  transport: string;
}

/* ---- Instant valuation ---- */
export type PropertyType = "house" | "unit" | "townhouse" | "apartment" | "land";

export interface ValuationRequest {
  suburb: string;
  street?: string;
  type: PropertyType;
  beds: number;
  baths: number;
  cars: number;
  landSize?: number;
}

export interface Comparable {
  address: string;
  sold_price: number;
  sold_date: string;
  note: string;
}

export interface ValuationResult {
  low: number;
  high: number;
  midpoint: number;
  confidence: "low" | "medium" | "high";
  rationale: string;
  comparables_used: Comparable[];
}

/* ---- Leads ---- */
export type LeadSource = "contact" | "valuation" | "concierge" | "mentor" | "partner";

export interface LeadPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  suburb?: string;
  message?: string;
  source?: LeadSource;
  intent?: string;
  estimateLow?: number;
  estimateHigh?: number;
  estimateMid?: number;
}

/* ---- Concierge / mentor chat (SSE) ---- */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type ChatEvent =
  | { type: "token"; text: string }
  | { type: "tool"; name: string }
  | { type: "lead_captured"; leadId: number }
  | { type: "done" }
  | { type: "error"; message: string };
