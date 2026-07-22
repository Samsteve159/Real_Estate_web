import { API_BASE } from "./config";
import type { ValuationRequest, ValuationResult, LeadPayload, Suburb } from "@manifest/core";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} failed (${res.status})`);
  return res.json() as Promise<T>;
}

export async function getSuburbs(): Promise<Suburb[]> {
  const res = await fetch(`${API_BASE}/suburbs`);
  if (!res.ok) throw new Error(`/suburbs failed (${res.status})`);
  const data = (await res.json()) as { suburbs: Suburb[] };
  return data.suburbs;
}

export const requestValuation = (req: ValuationRequest) =>
  post<ValuationResult>("/valuation", req);

export const submitLead = (lead: LeadPayload) =>
  post<{ ok: true; leadId: number }>("/lead", lead);

/**
 * Mentor chat is SSE streaming (POST /chat). RN's fetch doesn't expose a
 * ReadableStream reader, so Phase 2 wires this via expo/fetch streaming or
 * react-native-sse. Stubbed here so the UI can be built against it.
 */
export type { ChatMessage, ChatEvent } from "@manifest/core";
