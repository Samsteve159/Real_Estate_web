/**
 * Minimal in-memory analytics — counts per event, no PII, resets on restart.
 * Enough to answer "how much is the demo being used?" without a datastore.
 */
type Event = "valuation" | "chat" | "lead" | "valuation_error" | "chat_error";

const counts: Record<Event, number> = {
  valuation: 0,
  chat: 0,
  lead: 0,
  valuation_error: 0,
  chat_error: 0,
};

const since = new Date().toISOString();

export function track(event: Event): void {
  counts[event] += 1;
}

export function stats() {
  return { since, ...counts };
}
