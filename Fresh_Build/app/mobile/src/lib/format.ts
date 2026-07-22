import { formatAUD } from "@manifest/core";

/** Currency, no cents by default (re-exports the core Intl formatter). */
export const aud = (n: number, withCents = false) => formatAUD(n, withCents);

/** Compact currency for tight UI, e.g. $612k / $1.2m. */
export function audShort(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

export const pct = (dec: number, dp = 1) => `${(dec * 100).toFixed(dp)}%`;
