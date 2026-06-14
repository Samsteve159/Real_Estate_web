/**
 * Input guards for the public API. The rate limiter caps requests-per-minute;
 * these cap the *size* of each request so a single call can't blow up Claude
 * input-token cost or bloat the leads table. Strings are trimmed and clamped;
 * numbers must be finite and are clamped to a sane range.
 */

export const LIMITS = {
  str: 200, // suburb, street, type, name, phone, suburb
  email: 254, // RFC 5321 max
  address: 240,
  message: 2000,
  chatMsg: 4000, // per-message content
  chatTotal: 16_000, // summed content across the history
  chatCount: 40, // messages in a single request
} as const;

/** Trim + clamp an optional string. Returns undefined for empty/missing. */
export function str(v: unknown, max: number): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s ? s.slice(0, max) : undefined;
}

/** Parse a finite number and clamp to [min, max]. Returns undefined if invalid. */
export function num(v: unknown, min: number, max: number): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(Math.max(n, min), max);
}

export function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export interface ValidChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Validate + clamp a chat history. Drops malformed entries, caps per-message
 * length, and keeps the MOST RECENT messages within the count/total budget
 * (the latest user turn is what we must answer). Trims leading AND trailing
 * assistant turns so the history starts and ends with a user message — the
 * Anthropic API requires the former, and Opus rejects a trailing assistant
 * turn as an unsupported prefill. Returns an error string if unusable.
 */
export function validateChatHistory(
  raw: unknown,
): { ok: true; history: ValidChatMessage[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) return { ok: false, error: "messages required" };

  // Walk newest -> oldest so truncation drops stale history, not the live turn.
  const recent: ValidChatMessage[] = [];
  let total = 0;
  for (let i = raw.length - 1; i >= 0; i--) {
    const m = raw[i];
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const trimmed = content.slice(0, LIMITS.chatMsg);
    if (recent.length >= LIMITS.chatCount || total + trimmed.length > LIMITS.chatTotal) break;
    recent.push({ role, content: trimmed });
    total += trimmed.length;
  }

  const history = recent.reverse();
  // Must begin with a user turn (API requirement) and end with a user turn
  // (Opus rejects a trailing assistant turn as an unsupported prefill).
  while (history.length && history[0].role === "assistant") history.shift();
  while (history.length && history[history.length - 1].role === "assistant") history.pop();

  if (history.length === 0) return { ok: false, error: "messages required" };
  return { ok: true, history };
}
