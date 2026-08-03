import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { streamSSE } from "hono/streaming";

import { listings, suburbs, suburbNames } from "./data.js";
import { getVaultListings, getVaultListingDetail, vaultConfigured } from "./vault.js";
import { proxyVaultPhoto } from "./vaultPhoto.js";
import { valuate } from "./valuation.js";
import { saveLead, type LeadInput } from "./leads.js";
import { notifyNewLead } from "./email.js";
import { runConcierge } from "./chat.js";
import { rateLimit } from "./ratelimit.js";
import { track, stats } from "./analytics.js";
import { LIMITS, str, num, looksLikeEmail, validateChatHistory } from "./validate.js";

const app = new Hono();

// Vite proxies /api in dev so CORS isn't strictly needed. In production lock the
// API to the front-end origin(s) via ALLOWED_ORIGINS (comma-separated). When
// unset (local dev) it stays permissive.
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use("/api/*", cors(allowedOrigins.length ? { origin: allowedOrigins } : {}));

// Cap the Claude-backed endpoints per IP — guards against abuse and cost runaway.
app.use("/api/valuation", rateLimit("valuation", 8, 60_000));
app.use("/api/chat", rateLimit("chat", 15, 60_000));
app.use("/api/lead", rateLimit("lead", 20, 60_000));
// Vault has its own hard cap (10 req/s, 10k/day) — protect our own use of it too.
app.use("/api/vault/*", rateLimit("vault", 60, 60_000));

app.get("/api/health", (c) => c.json({ ok: true }));

// Usage counters leak business metrics (lead counts) — gate behind STATS_TOKEN
// when set. Unset (local dev) leaves it open.
app.get("/api/stats", (c) => {
  const token = process.env.STATS_TOKEN;
  if (token) {
    const provided = c.req.header("x-stats-token") ?? c.req.query("token");
    if (provided !== token) return c.json({ error: "Unauthorized" }, 401);
  }
  return c.json(stats());
});

// Public data the front-end renders (real listings + suburb context).
app.get("/api/listings", (c) => c.json({ listings }));
app.get("/api/suburbs", (c) => c.json({ suburbs, names: suburbNames }));

// Live listings from Vault RE (MRI), normalised + cached. `isLive` tells the
// front-end whether real data came back; when false it keeps its placeholders.
app.get("/api/vault/listings", async (c) => {
  if (!vaultConfigured()) {
    return c.json({ isLive: false, reason: "not_configured", listings: [] });
  }
  const data = await getVaultListings();
  if (!data) {
    return c.json({ isLive: false, reason: "unavailable", listings: [] });
  }
  return c.json({ isLive: true, listings: data });
});

// One property's full detail — the listing-detail page (/properties/{id} on the front-end).
app.get("/api/vault/listings/:id", async (c) => {
  const id = c.req.param("id");
  if (!vaultConfigured()) {
    return c.json({ isLive: false, reason: "not_configured", listing: null });
  }
  const listing = await getVaultListingDetail(id);
  if (!listing) {
    return c.json({ isLive: false, reason: "unavailable", listing: null }, 404);
  }
  return c.json({ isLive: true, listing });
});

// Self-hosts a Vault photo: downloads + caches to disk on first request, serves
// from disk after. `src` is host-restricted to Vault's own CDN (see vaultPhoto.ts).
app.get("/api/vault/photo", async (c) => {
  const src = c.req.query("src");
  if (!src) return c.text("Missing src", 400);
  const photo = await proxyVaultPhoto(src);
  if (!photo) return c.text("Not found", 404);
  c.header("Content-Type", photo.contentType);
  c.header("Cache-Control", "public, max-age=86400, immutable");
  return c.body(new Uint8Array(photo.buffer));
});

// --- Instant Home Valuation -------------------------------------------------
app.post("/api/valuation", async (c) => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const suburb = str(body.suburb, LIMITS.str);
  const type = str(body.type, LIMITS.str);
  const beds = num(body.beds, 0, 20);
  if (!suburb || !type || beds == null) {
    return c.json({ error: "suburb, type and beds are required" }, 400);
  }

  try {
    const result = await valuate({
      suburb,
      street: str(body.street, LIMITS.str),
      type,
      beds,
      baths: num(body.baths, 0, 20) ?? 1,
      cars: num(body.cars, 0, 20) ?? 0,
      landSize: num(body.landSize, 0, 100_000),
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

  const name = str(body.name, LIMITS.str);
  const email = str(body.email, LIMITS.email);
  const phone = str(body.phone, LIMITS.str);
  if (!name || (!email && !phone)) {
    return c.json({ error: "name and a phone or email are required" }, 400);
  }
  if (email && !looksLikeEmail(email)) {
    return c.json({ error: "Please provide a valid email address" }, 400);
  }

  // Default to the valuation/sell flow; the contact form passes source "contact".
  const rawSource = str(body.source, LIMITS.str);
  const source = rawSource === "contact" ? "contact" : "valuation";
  const intent = source === "contact" ? (str(body.intent, LIMITS.str) || "enquiry") : "sell";

  const leadInput: LeadInput = {
    source,
    name,
    email,
    phone,
    address: str(body.address, LIMITS.address),
    suburb: str(body.suburb, LIMITS.str),
    intent,
    estimateLow: num(body.estimateLow, 0, 1_000_000_000),
    estimateHigh: num(body.estimateHigh, 0, 1_000_000_000),
    estimateMid: num(body.estimateMid, 0, 1_000_000_000),
    message: str(body.message, LIMITS.message),
  };
  const id = saveLead(leadInput);
  track("lead");

  // Borrowing-capacity figures for the PDF. Clamped like every other input so a
  // crafted payload can't inject absurd values into a branded document.
  const r = (body.report ?? {}) as Record<string, unknown>;
  const money = (v: unknown) => num(v, 0, 1_000_000_000);
  const report =
    intent === "report"
      ? {
          grossIncome: money(r.grossIncome),
          monthlyExpenses: money(r.monthlyExpenses),
          monthlyDebts: money(r.monthlyDebts),
          savings: money(r.savings),
          purchasePrice: money(r.purchasePrice),
          interestRate: num(r.interestRate, 0, 100),
          buyerType: str(r.buyerType, LIMITS.str),
          maxBorrow: money(r.maxBorrow),
          maxPurchase: money(r.maxPurchase),
          loanNeeded: money(r.loanNeeded),
          depositAmount: money(r.depositAmount),
          lvr: num(r.lvr, 0, 1000),
          lmi: money(r.lmi),
          stampDuty: money(r.stampDuty),
          upfrontCosts: money(r.upfrontCosts),
          monthlyRepayment: money(r.monthlyRepayment),
          canService: typeof r.canService === "boolean" ? r.canService : undefined,
        }
      : undefined;
  // Fire-and-forget: the lead is already saved, so a slow/failed email never
  // holds up or breaks the response. See email.ts for the no-op-when-unconfigured behaviour.
  void notifyNewLead({ ...leadInput, leadId: id, report }).catch((err) => console.error("[email] notify failed", err));
  return c.json({ ok: true, leadId: id });
});

// --- AI Buyer Concierge (streamed) ------------------------------------------
app.post("/api/chat", async (c) => {
  let body: { messages?: unknown };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const validated = validateChatHistory(body.messages);
  if (!validated.ok) {
    return c.json({ error: validated.error }, 400);
  }

  track("chat");
  return streamSSE(c, async (stream) => {
    await runConcierge(validated.history, (event) => {
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
