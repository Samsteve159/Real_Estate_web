# Project Tracker — Manifest RE AI Companion

Phased delivery tracker. See `plan.md` (same folder) for the full plan and the repo-root `README.md` for how to run.

**Repo:** `git@github.com:Samsteve159/Real_Estate_web.git` · **Branch:** `main`
**Last updated:** 2026-06-15 · **Models:** `claude-opus-4-8` (valuation + concierge)

**Status legend:** ✅ done · 🟡 in progress / needs live test · ⬜ not started · 🔭 backlog

---

## Phase 1 — Scaffold + design the microsite ✅
*Teaches: setup, design. Milestone: polished site at :5173 with real listings.*

- [x] Vite + React + TS + Tailwind v4 front-end (`web/`)
- [x] Hono + `@anthropic-ai/sdk` API (`api/`), Node-local, Workers-ready
- [x] Repo organised into `web/ · api/ · data/`; `.env` kept server-side; `.gitignore`
- [x] Distinctive "inner-west editorial" design system (bone/navy/teal/terracotta, Instrument Serif + Archivo)
- [x] Seed data: `listings.json`, `suburbs.json`, `sold.json` (representative)
- [x] Real `ListingCard`s rendered from `/api/listings`
- [x] ✅ Real listings scraped from his **public** site — 20 live listings via `scripts/scrape-listings.mjs` (pure HTML parsing, no LLM, $0); representative data kept as `data/listings.seed.json`

## Phase 2 — Instant Home Valuation ✅
*Teaches: Claude API, prompt engineering, structured JSON. Milestone: address → range + rationale → lead saved.*

- [x] `ValuationForm` — suburb dropdown, street, type, bed/bath/car steppers, land size
- [x] `POST /api/valuation` — Claude over comps → `{low, high, midpoint, confidence, rationale, comparables_used}`
- [x] Result UI: range, confidence badge, rationale, comparables, "indicative estimate" labelling
- [x] `POST /api/lead` persists name/contact/address + estimate to SQLite
- [x] ✅ **Live test (Opus 4.8):** Newport 3bd → $1.18M–$1.32M, high confidence, cited same-street comp; seller lead row landed in `data/leads.db`
- [ ] 🔭 Optional: email the agent on new lead (free tier)

## Phase 3 — AI Buyer Concierge Chatbot ✅
*Teaches: system prompts, tool use, light RAG, streaming. Milestone: listing question → matches stream → inspection booked → lead captured.*

- [x] `ConciergeWidget` — floating bubble + panel, streamed responses, suggestion chips
- [x] `POST /api/chat` — system prompt scoped to Manifest RE, listings injected as context (light RAG)
- [x] Tool: `search_listings(filters)` → live filtered matches
- [x] Tool: `capture_lead(name, contact, intent)` → writes to leads store
- [x] SSE token streaming to the UI
- [x] ✅ **Live test (Opus 4.8):** "3-beds under $1M near Newport" → `search_listings` ×2 → accurate matches; "inspect 31 The Avenue, I'm Jordan…" → `capture_lead` wrote the lead row

## Phase 4 — Polish + decide deployment 🟡
*Teaches: deployment.*

- [x] ✅ Basic API rate-limiting — per-IP sliding window on `/api/valuation` (8/min), `/api/chat` (15/min), `/api/lead` (20/min); returns 429 + Retry-After
- [x] ✅ Simple analytics — in-memory counters at `GET /api/stats`
- [x] ✅ Loading/empty/error states + global `ErrorBoundary` + 404 route + rate-limit (429) messaging surfaced in UI
- [x] ✅ **security-review** — hardened public API: input size/numeric caps + `validate.ts` (stops Claude input-token cost runaway + DB bloat), CORS locked to `ALLOWED_ORIGINS` in prod, `/api/stats` gated behind `STATS_TOKEN`, email/NaN validation. Verified live (400s, 401/200, both AI happy paths, oversized/trailing-assistant histories clean).
- [x] ✅ **code-review** of the diff — caught + fixed a chat-history truncation bug (was dropping the newest turn / could send an Opus-rejected trailing-assistant prefill); now keeps recent turns and trims leading/trailing assistant turns.
- [x] ✅ **Extended valuation data to the real footprint** — added the 7 outer-west/north corridor suburbs that had listings but no median/comp data (Keilor East, Sunbury, Beveridge, Wallan, Werribee, Weir Views, Winter Valley) to `suburbs.json` (medians) + `sold.json` (~25 comps). Now 14 suburbs / 47 comps; **every listing suburb is covered**. Valuation SYSTEM-prompt service-area copy broadened. Live-verified: Sunbury 4bd → $670k–$740k (high) citing the new Sunbury comps; Newport unchanged (no regression).
- [x] ✅ **Embeddable widgets (iframe approach)** — chrome-less `/embed/valuation` + `/embed/concierge` routes (bare layout in `App.tsx`), `inline` mode on `ConciergeWidget`, `web/public/embed.js` loader + `embed-demo.html`, postMessage auto-resize for the valuation iframe, `VITE_API_BASE` indirection in `lib/api.ts`. Served same-origin so `/api` keeps working with no CORS. `tsc -b` + `vite build` green; `embed.js` ships to `dist/`.
- [x] ✅ **Mobile/responsive fixes** (code audit) — clamped concierge panel height (`min(34rem,75svh)`) + tighter mobile width/position, abbreviated launcher & Nav-CTA text on small screens, bumped Nav CTA tap target, reduced valuation-form padding/stepper gap at 360px.
- [x] ✅ **Mobile/responsive QA** — driven live with Playwright at 390px (mobile) + 768px (tablet): nav/launcher text abbreviates correctly, concierge panel fits the viewport (212→756 of 844, no clip), no horizontal/form overflow, valuation runs end-to-end for a **new** suburb (Sunbury 3bd → $545k–$615k citing the new comps), concierge streams, and both `/embed/*` routes render chrome-less. Screenshots captured. *(Optional: a quick spot-check on a physical handset.)*
- [x] ✅ **Anthropic spend cap set** (owner — monthly cap in the Anthropic console).
- [ ] Deploy on a **VM** — **deferred: running local-first** per owner ("let's see how it functions local first"). When ready: Node + Hono + SQLite stack ports directly; needs a process manager + reverse proxy with SPA fallback (incl. `/embed/*`) + env vars `ALLOWED_ORIGINS` / `STATS_TOKEN`.

---

## Backlog / open follow-ups 🔭
- [ ] Phase 5 (optional): AI Listing Copy Generator (agent-facing)
- [ ] Source of *real* suburb median data to ground valuations beyond comps alone (current corridor medians are representative)
- [x] ✅ Deploy target decided: **VM** (owner) — local-first until happy, then deploy. Cloudflare Workers/D1 path dropped.

## Known constraints
- Installed `@anthropic-ai/sdk@0.68.0` doesn't type `output_config` (structured outputs); valuation requests strict JSON and parses it tolerantly. Revisit if the SDK is upgraded.
- `ANTHROPIC_API_KEY` lives in repo-root `.env` (gitignored). Never commit it; `.env.example` stays a placeholder. Both AI flows verified live on Opus 4.8.

## New env vars (set on deploy)
- `ALLOWED_ORIGINS` — comma-separated front-end origins; locks CORS in prod (unset = open, for local dev).
- `STATS_TOKEN` — required to read `GET /api/stats` when set (send as `x-stats-token` header or `?token=`).

## Immediate next up (all owner-owned)
1. Final mobile QA on a real device (responsive code fixes already in; needs a real handset pass).
2. Set Anthropic spend cap before any shared link.
3. When happy with local: deploy on the VM (process manager + reverse proxy with SPA fallback incl. `/embed/*`; set `ALLOWED_ORIGINS` / `STATS_TOKEN`). Then point the embed `<script src>` in `embed-demo.html` / the WordPress theme at the deployed host.

> Open the embed demo locally: run `web` + `api` dev servers, then open `embed-demo.html` (loads `embed.js` from `http://localhost:5173`).
