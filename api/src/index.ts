import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { streamSSE } from "hono/streaming";

import { listings, suburbs, suburbNames } from "./data.js";
import { valuate, type ValuationRequest } from "./valuation.js";
import { saveLead } from "./leads.js";
import { runConcierge, type ChatMessage } from "./chat.js";
import { rateLimit } from "./ratelimit.js";
import { track, stats } from "./analytics.js";

const app = new Hono();

// Vite proxies /api in dev so CORS isn't strictly needed, but allow it for the
// case where the front-end is served from a different origin.
app.use("/api/*", cors());

// Cap the Claude-backed endpoints per IP — guards against abuse and cost runaway.
app.use("/api/valuation", rateLimit("valuation", 8, 60_000));
app.use("/api/chat", rateLimit("chat", 15, 60_000));
app.use("/api/lead", rateLimit("lead", 20, 60_000));

app.get("/api/health", (c) => c.json({ ok: true }));
app.get("/api/stats", (c) => c.json(stats()));

// Public data the front-end renders (real listings + suburb context).
app.get("/api/listings", (c) => c.json({ listings }));
app.get("/api/suburbs", (c) => c.json({ suburbs, names: suburbNames }));

// --- Instant Home Valuation -------------------------------------------------
app.post("/api/valuation", async (c) => {
  let body: Partial<ValuationRequest>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (!body.suburb || !body.type || body.beds == null) {
    return c.json({ error: "suburb, type and beds are required" }, 400);
  }

  try {
    const result = await valuate({
      suburb: body.suburb,
      street: body.street,
      type: body.type,
      beds: Number(body.beds),
      baths: Number(body.baths ?? 1),
      cars: Number(body.cars ?? 0),
      landSize: body.landSize != null ? Number(body.landSize) : undefined,
    });
    track("valuation");
    return c.json(result);
  } catch (err) {
    console.error("[valuation] error", err);
    track("valuation_error");
    return c.json({ error: "Could not generate a valuation right now." }, 502);
  }
});

// --- Lead capture (valuation form CTA) --------------------------------------
app.post("/api/lead", async (c) => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (!body.name || (!body.email && !body.phone)) {
    return c.json({ error: "name and a phone or email are required" }, 400);
  }

  const id = saveLead({
    source: "valuation",
    name: String(body.name),
    email: body.email ? String(body.email) : undefined,
    phone: body.phone ? String(body.phone) : undefined,
    address: body.address ? String(body.address) : undefined,
    suburb: body.suburb ? String(body.suburb) : undefined,
    intent: "sell",
    estimateLow: body.estimateLow != null ? Number(body.estimateLow) : undefined,
    estimateHigh: body.estimateHigh != null ? Number(body.estimateHigh) : undefined,
    estimateMid: body.estimateMid != null ? Number(body.estimateMid) : undefined,
    message: body.message ? String(body.message) : undefined,
  });
  track("lead");
  return c.json({ ok: true, leadId: id });
});

// --- AI Buyer Concierge (streamed) ------------------------------------------
app.post("/api/chat", async (c) => {
  let body: { messages?: ChatMessage[] };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const history = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
  );
  if (history.length === 0) {
    return c.json({ error: "messages required" }, 400);
  }

  track("chat");
  return streamSSE(c, async (stream) => {
    await runConcierge(history, (event) => {
      if (event.type === "error") track("chat_error");
      // Fire-and-forget write; streamSSE serialises these in order.
      void stream.writeSSE({ data: JSON.stringify(event) });
    });
  });
});

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, () => {
  console.log(`[api] Manifest API listening on http://localhost:${port}`);
});
