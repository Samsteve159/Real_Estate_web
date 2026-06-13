import Anthropic from "@anthropic-ai/sdk";
import { anthropic, CHAT_MODEL, AGENT_NAME, AGENT_TAGLINE } from "./anthropic.js";
import { listings, suburbNames, searchListings } from "./data.js";
import { saveLead } from "./leads.js";

// Light RAG: the listing book is small enough to inject directly as context,
// so the model can answer most questions without a tool round-trip and uses
// search_listings mainly to return precise, filtered matches.
const listingDigest = listings
  .map(
    (l) =>
      `[${l.id}] ${l.address} — ${l.type}, ${l.beds}bd/${l.baths}ba/${l.cars}car, ${l.price}. ${l.headline}.`,
  )
  .join("\n");

const SYSTEM = `You are the AI Buyer Concierge for ${AGENT_NAME}, an independent agency covering Melbourne's inner and outer west (${AGENT_TAGLINE}). You help buyers explore current listings, learn about the suburbs, and book an inspection or a callback with the agent.

Style: warm, concise, genuinely helpful — like a sharp local agent, not a chatbot. Use Australian spelling and AUD. Keep replies short; use a tight list when showing properties.

Service suburbs: ${suburbNames.join(", ")}.

Current listings (your live knowledge — never invent properties beyond these):
${listingDigest}

How to work:
- For specific buyer criteria (beds, budget, suburb, type) call search_listings to return accurate matches rather than eyeballing the list.
- Recommend honestly. If nothing matches, say so and offer the closest options or to register their brief.
- When a buyer wants to inspect a property, get a callback, or is clearly a strong lead, call capture_lead to record their details. Ask for a name and a phone or email first if you don't have them — don't fabricate contact details.
- Never quote a firm valuation; for "what's my home worth" point them to the free instant valuation tool on the site.
- After capturing a lead, confirm warmly that the agent will be in touch.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_listings",
    description:
      "Search Manifest's current for-sale listings by buyer criteria. Returns matching properties. Call this whenever the buyer gives concrete criteria (suburb, budget, bedrooms, property type).",
    input_schema: {
      type: "object",
      properties: {
        suburb: { type: "string", description: "One of the service suburbs" },
        min_beds: { type: "integer", description: "Minimum bedrooms" },
        max_price: { type: "integer", description: "Maximum budget in AUD" },
        min_price: { type: "integer", description: "Minimum budget in AUD" },
        type: {
          type: "string",
          description: "Dwelling type, e.g. House, Townhouse, Apartment",
        },
      },
    },
  },
  {
    name: "capture_lead",
    description:
      "Record a buyer lead and request a callback or inspection. Call this once you have the buyer's name and at least one contact (phone or email) and they want to inspect, get a callback, or register their brief.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        contact: {
          type: "string",
          description: "Phone number and/or email address",
        },
        intent: {
          type: "string",
          description:
            "What they want, e.g. 'inspection for 14 Maddox Road', 'callback', 'register buyer brief'",
        },
        suburb: { type: "string" },
        notes: { type: "string", description: "Brief, budget, or any context" },
      },
      required: ["name", "contact", "intent"],
    },
  },
];

function splitContact(contact: string): { email?: string; phone?: string } {
  const email = contact.match(/[^\s,;]+@[^\s,;]+\.[^\s,;]+/)?.[0];
  const phone = contact.match(/(\+?\d[\d\s()-]{6,}\d)/)?.[0]?.trim();
  return { email, phone };
}

function runTool(name: string, input: Record<string, unknown>): string {
  if (name === "search_listings") {
    const matches = searchListings({
      suburb: input.suburb as string | undefined,
      minBeds: input.min_beds as number | undefined,
      maxPrice: input.max_price as number | undefined,
      minPrice: input.min_price as number | undefined,
      type: input.type as string | undefined,
    });
    if (matches.length === 0) {
      return JSON.stringify({ count: 0, matches: [], note: "No current listings match." });
    }
    return JSON.stringify({
      count: matches.length,
      matches: matches.map((m) => ({
        id: m.id,
        address: m.address,
        suburb: m.suburb,
        price: m.price,
        beds: m.beds,
        baths: m.baths,
        cars: m.cars,
        type: m.type,
        headline: m.headline,
        features: m.features,
      })),
    });
  }

  if (name === "capture_lead") {
    const { email, phone } = splitContact(String(input.contact ?? ""));
    const id = saveLead({
      source: "concierge",
      name: input.name as string,
      email,
      phone,
      suburb: input.suburb as string | undefined,
      intent: input.intent as string,
      message: input.notes as string | undefined,
    });
    return JSON.stringify({
      saved: true,
      lead_id: id,
      confirmation: "Lead recorded — the agent will follow up.",
    });
  }

  return JSON.stringify({ error: `Unknown tool: ${name}` });
}

export type ChatEvent =
  | { type: "token"; text: string }
  | { type: "tool"; name: string }
  | { type: "lead_captured"; leadId: number }
  | { type: "done" }
  | { type: "error"; message: string };

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Run the concierge agentic loop, streaming events to `emit`. Streams text
 * tokens as they arrive and transparently handles search_listings /
 * capture_lead tool calls until the model produces a final answer.
 */
export async function runConcierge(
  history: ChatMessage[],
  emit: (event: ChatEvent) => void,
): Promise<void> {
  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    for (let turn = 0; turn < 6; turn++) {
      const stream = anthropic.messages.stream({
        model: CHAT_MODEL,
        max_tokens: 1024,
        system: SYSTEM,
        tools: TOOLS,
        messages,
      });

      stream.on("text", (delta) => emit({ type: "token", text: delta }));

      const message = await stream.finalMessage();
      messages.push({ role: "assistant", content: message.content });

      if (message.stop_reason !== "tool_use") {
        emit({ type: "done" });
        return;
      }

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of message.content) {
        if (block.type !== "tool_use") continue;
        emit({ type: "tool", name: block.name });
        const result = runTool(block.name, block.input as Record<string, unknown>);
        if (block.name === "capture_lead") {
          const parsed = JSON.parse(result);
          if (parsed.lead_id) emit({ type: "lead_captured", leadId: parsed.lead_id });
        }
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }
      messages.push({ role: "user", content: toolResults });
    }
    emit({ type: "done" });
  } catch (err) {
    console.error("[concierge] error", err);
    emit({
      type: "error",
      message: "Sorry — I hit a snag. Please try again in a moment.",
    });
  }
}
