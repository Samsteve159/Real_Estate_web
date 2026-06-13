# Project Tracker — Manifest RE AI Companion

Phased delivery tracker. See `plan.md` for the full plan and `README.md` for how to run.

**Repo:** `git@github.com:Samsteve159/Real_Estate_web.git` · **Branch:** `main`
**Last updated:** 2026-06-13

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
- [ ] 🔭 Replace representative seed data with a one-off scrape of his **public** site

## Phase 2 — Instant Home Valuation 🟡
*Teaches: Claude API, prompt engineering, structured JSON. Milestone: address → range + rationale → lead saved.*

- [x] `ValuationForm` — suburb dropdown, street, type, bed/bath/car steppers, land size
- [x] `POST /api/valuation` — Claude over comps → `{low, high, midpoint, confidence, rationale, comparables_used}`
- [x] Result UI: range, confidence badge, rationale, comparables, "indicative estimate" labelling
- [x] `POST /api/lead` persists name/contact/address + estimate to SQLite
- [ ] 🟡 **Live end-to-end test** (needs `ANTHROPIC_API_KEY` in `.env`): submit → range renders → row lands in `data/leads.db`
- [ ] 🔭 Optional: email the agent on new lead (free tier)

## Phase 3 — AI Buyer Concierge Chatbot 🟡
*Teaches: system prompts, tool use, light RAG, streaming. Milestone: listing question → matches stream → inspection booked → lead captured.*

- [x] `ConciergeWidget` — floating bubble + panel, streamed responses, suggestion chips
- [x] `POST /api/chat` — system prompt scoped to Manifest RE, listings injected as context (light RAG)
- [x] Tool: `search_listings(filters)` → live filtered matches
- [x] Tool: `capture_lead(name, contact, intent)` → writes to leads store
- [x] SSE token streaming to the UI
- [ ] 🟡 **Live end-to-end test** (needs key): "3-beds under $1M near Newport" → matches → books inspection → lead row

## Phase 4 — Polish + decide deployment ⬜
*Teaches: deployment.*

- [ ] Mobile pass + loading/empty/error states audit
- [ ] Basic API rate-limiting + simple analytics
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
- The two AI flows are **unverified live** until an `ANTHROPIC_API_KEY` is set (`cp .env.example .env`).

## Immediate next up
1. Add `ANTHROPIC_API_KEY` → live-test valuation + concierge (closes the 🟡 items).
2. Decide: real public-site scrape vs keep representative seed data.
3. Run security-review before any shared link.
