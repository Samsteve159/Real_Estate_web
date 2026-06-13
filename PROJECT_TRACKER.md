# Project Tracker — Manifest RE AI Companion

Phased delivery tracker. See `plan.md` for the full plan and `README.md` for how to run.

**Repo:** `git@github.com:Samsteve159/Real_Estate_web.git` · **Branch:** `main`
**Last updated:** 2026-06-13 · **Models:** `claude-opus-4-8` (valuation + concierge)

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
- [ ] Final mobile QA pass on a real device
- [ ] **security-review** (handles PII + server-side API key) — run before any live link
- [ ] **code-review** of the full diff
- [ ] Set Anthropic spend cap before sharing any deployed link
- [ ] Deploy: `web/` → Cloudflare Pages · `api/` → Workers · `leads.db` → D1
- [ ] Package the two tools as embeddable iframe/script widgets for manifestre.com.au

---

## Backlog / open follow-ups 🔭
- [ ] Phase 5 (optional): AI Listing Copy Generator (agent-facing)
- [ ] Source of suburb median data to ground valuations beyond comps alone
- [ ] Decide final deploy target (Cloudflare vs VM) at Phase 4

## Known constraints
- Installed `@anthropic-ai/sdk@0.68.0` doesn't type `output_config` (structured outputs); valuation requests strict JSON and parses it tolerantly. Revisit if the SDK is upgraded.
- `ANTHROPIC_API_KEY` lives in repo-root `.env` (gitignored). Never commit it; `.env.example` stays a placeholder. Both AI flows verified live on Opus 4.8.

## Immediate next up
1. Final mobile QA on a real device.
2. Run **security-review** + **code-review** before any shared link; set Anthropic spend cap.
3. Note: valuation `suburbs.json`/`sold.json` are still representative inner-west data — real listings now span the outer-west/north growth corridors (Sunbury, Beveridge, Keilor East…). Decide whether to extend the valuation service area to match.
