/* ================================================================== *
 *  @manifest/core — shared, framework-agnostic logic
 *
 *  Pure TypeScript: deterministic calculators, domain types, and the
 *  journey model. Consumed by the Expo app (and reusable by the web).
 *  No React, no DOM, no browser assumptions.
 * ================================================================== */

// Deterministic calculators (ported from the proven website)
export * from "./stampDuty";
export * from "./preBuying";
export * from "./rental";
export * from "./portfolio";

// Shared API / domain types
export * from "./types";

// The 7-stage buyer journey model + data
export * from "./journey";
