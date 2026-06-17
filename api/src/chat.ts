import Anthropic from "@anthropic-ai/sdk";
import { anthropic, CHAT_MODEL, AGENT_NAME, AGENT_TAGLINE, AGENTS } from "./anthropic.js";
import { listings, searchListings } from "./data.js";
import { saveLead } from "./leads.js";

// Suburbs Manifest actually has stock in right now — derived from live listings
// so the concierge stays accurate as the listing set changes.
const activeSuburbs = [...new Set(listings.map((l) => l.suburb))];

// Light RAG: the listing book is small enough to inject directly as context,
// so the model can answer most questions without a tool round-trip and uses
// search_listings mainly to return precise, filtered matches.
const listingDigest = listings
  .map(
    (l) =>
      `[${l.id}] ${l.address}: ${l.type}, ${l.beds}bd/${l.baths}ba/${l.cars}car, ${l.price}. ${l.headline}.`,
  )
  .join("\n");

const SYSTEM = `You are the AI Buyer Concierge for ${AGENT_NAME}, an independent agency covering Melbourne's inner and outer west (${AGENT_TAGLINE}). You help buyers explore current listings, learn about the suburbs, and book an inspection or a callback with the agent.

Style: warm, concise, genuinely helpful, like a sharp local agent rather than a chatbot. Use Australian spelling and AUD. Keep replies short; use a tight list when showing properties. Never use em dashes (the "—" character). Write with commas, full stops, or short separate sentences instead.

The agents buyers deal with are ${AGENTS}. Refer to them by name to keep things personal: when you arrange a callback or inspection, say something like "I'll have ${AGENTS.split(" and ")[1] ?? AGENTS} give you a call" or "${AGENTS} will be in touch", rather than a faceless "an agent" or "the agent".

Suburbs with current stock: ${activeSuburbs.join(", ")}.

Current listings (your live knowledge; never invent properties beyond these):
${listingDigest}

Hard rules, stay grounded in Manifest's book:
- ONLY ever discuss the specific properties in the listing book above. Never reference, count, estimate, or invent any property, price, suburb statistic, or "X properties available" figure from outside it. You have no knowledge of any other listings.
- A property only counts as being "in" a suburb if its suburb field matches. Never present a listing from one suburb as a match for another suburb the buyer named.

How to work:
- When a buyer signals they want to buy a property but hasn't told you their budget yet, ask for it first (a rough price range is fine) before searching or recommending any listings. Ask warmly and just once. If they say they're unsure or would rather not say, reassure them and carry on, using search_listings to show what's available across price points.
- Whenever a buyer names a suburb or gives concrete criteria (beds, budget, type), call search_listings (with the suburb set) and present ONLY what it returns. Don't eyeball the digest or recommend a different suburb's property as the answer.
- If the buyer asked about a specific suburb and search_listings returns nothing there, say plainly that Manifest doesn't have anything listed in that suburb right now, then offer the closest current listings (clearly naming their actual suburb, e.g. "over in Keilor East") or to register their buyer brief. Never paper over an empty suburb with another suburb's stock.
- Recommend honestly within the matches you actually have.
- When a buyer wants to inspect a property, get a callback, or is clearly a strong lead, call capture_lead to record their details. Ask for a name and a phone or email first if you don't have them, and don't fabricate contact details.
- Never quote a firm valuation; for "what's my home worth" point them to the free instant valuation tool on the site.
- After capturing a lead, confirm warmly and by name that ${AGENTS} will be in touch.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_listings",
    description:
      "Search Manifest's current for-sale listings by buyer criteria. Returns ONLY listings whose fields match the filters; an empty result means Manifest has no such stock. Call this whenever the buyer names a suburb or gives concrete criteria (budget, bedrooms, property type), and always pass the suburb when they mention one; results are scoped to that exact suburb.",
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
      confirmation: `Lead recorded. ${AGENTS} will follow up.`,
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
      message: "Sorry, I hit a snag. Please try again in a moment.",
    });
  }
}
