// Thin fetch wrappers around the Hono API. In dev, Vite proxies /api → :8787.
// Default is the relative "/api" (same-origin — works for the site and for
// iframe embeds served from this origin). A cross-origin script embed can point
// at an absolute API by building with VITE_API_BASE=https://host/api.
const API_BASE = ((import.meta.env.VITE_API_BASE as string | undefined) ?? "/api").replace(/\/$/, "");

export interface Listing {
  id: string;
  address: string;
  suburb: string;
  price: string;
  priceNumeric: number;
  beds: number;
  baths: number;
  cars: number;
  landSize: number;
  type: string;
  status: string;
  headline: string;
  blurb: string;
  features: string[];
}

export interface Suburb {
  name: string;
  postcode: string;
  medianHouse: number;
  medianUnit: number;
  trend12mo: string;
  blurb: string;
  lifestyle: string;
  transport: string;
}

export interface ValuationRequest {
  suburb: string;
  street?: string;
  type: string;
  beds: number;
  baths: number;
  cars: number;
  landSize?: number;
}

export interface ValuationResult {
  low: number;
  high: number;
  midpoint: number;
  confidence: "low" | "medium" | "high";
  rationale: string;
  comparables_used: {
    address: string;
    sold_price: number;
    sold_date: string;
    note: string;
  }[];
}

export interface LeadPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  suburb?: string;
  message?: string;
  estimateLow?: number;
  estimateHigh?: number;
  estimateMid?: number;
}

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function getListings(): Promise<Listing[]> {
  const data = await jsonOrThrow<{ listings: Listing[] }>(await fetch(`${API_BASE}/listings`));
  return data.listings;
}

export async function getSuburbs(): Promise<Suburb[]> {
  const data = await jsonOrThrow<{ suburbs: Suburb[] }>(await fetch(`${API_BASE}/suburbs`));
  return data.suburbs;
}

export async function requestValuation(req: ValuationRequest): Promise<ValuationResult> {
  return jsonOrThrow<ValuationResult>(
    await fetch(`${API_BASE}/valuation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    }),
  );
}

export async function submitLead(lead: LeadPayload): Promise<{ leadId: number }> {
  return jsonOrThrow<{ ok: true; leadId: number }>(
    await fetch(`${API_BASE}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }),
  );
}

// --- Concierge streaming ----------------------------------------------------

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

/**
 * POST the conversation and consume the SSE stream, invoking `onEvent` for each
 * server event (token deltas, tool calls, lead capture, done/error).
 */
export async function streamChat(
  messages: ChatMessage[],
  onEvent: (e: ChatEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok || !res.body) {
    let message = "The concierge is unavailable right now.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* non-JSON body */
    }
    onEvent({ type: "error", message });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawTerminal = false;

  const handle = (raw: string) => {
    try {
      const e = JSON.parse(raw) as ChatEvent;
      if (e.type === "done" || e.type === "error") sawTerminal = true;
      onEvent(e);
    } catch {
      /* ignore keep-alive / malformed frame */
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line; each frame has `data:` lines.
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      const line = frame.split("\n").find((l) => l.startsWith("data:"));
      if (line) handle(line.slice(5).trim());
    }
  }

  // Flush a trailing frame the stream may have closed on without a blank line.
  const tail = buffer.split("\n").find((l) => l.startsWith("data:"));
  if (tail) handle(tail.slice(5).trim());

  // The server writes its final `done` fire-and-forget, so the stream can close
  // before that event flushes (and any connection can drop mid-stream). Without
  // a terminal event the UI stays stuck in the streaming state — so synthesise
  // one. Idempotent when a real `done`/`error` already arrived.
  if (!sawTerminal) onEvent({ type: "done" });
}
