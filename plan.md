# Plan: AI Companion Site for Manifest Real Estate

## Context

A mate runs **Manifest Real Estate** (manifestre.com.au) — an agent covering Altona North / South Kingsville / Newport and the inner- + outer-west of Melbourne. His current site is a **WordPress real-estate template** with listings fed from a CRM/portal (property IDs like `property_id=1770416`). That managed feed + theme is almost certainly *why he can't get edit rights yet* — a provider controls it.

The site already has table-stakes features (property search, buyer alerts, appraisal request, newsletter, borrowing/repayment/stamp-duty calculators, due-diligence checklist). What it lacks is **design polish and any AI differentiation** — and that's the opportunity.

**Strategy:** Because he can't touch the live site, we build a **separate companion site, run locally first** ($0, on localhost) that (a) looks far better and (b) ships two AI tools his template can't give him. It doubles as a live demo to win him over, and is engineered so that later it can either *become* the new site or its tools can *embed into* manifestre.com.au once he gets rights — nothing wasted. Deployment target (Cloudflare Pages, free) is decided later.

**Learning track (AI, built into the phases):** Claude API basics → prompt engineering / structured output → tool use (function calling) → light RAG → deployment.

---

## Market scope (2026) — why these two tools

- **~87–97% of agencies now use AI daily.** The differentiators a small independent agent *can't* get from a template are: AI listing-copy generation, **instant home valuation + lead capture**, **conversational/concierge chatbots**, and natural-language search.
- Paid incumbents own the high end (HouseCanary AVM, Saleswise, BoxBrownie staging). The **low end is wide open** for a custom build.
- **Lead-gen is the commercial point.** "What's my home worth?" tools are the #1 seller-lead magnet — the estimate is the hook, the real value is the captured contact + the agent doing a real appraisal.
- Free hosting is solved: **Cloudflare Pages** (unlimited bandwidth, global CDN, HTTPS, $0).

**Chosen heroes:** (1) **Instant Home Valuation** — best lead magnet + demo wow; (2) **AI Buyer Concierge Chatbot** — 24/7 engagement + teaches the richest AI concepts.

---

## Stack (local-first, deploys cleanly later) — NO Astro

| Concern | Choice | Why |
|---|---|---|
| Site + UI | **Vite + React + Tailwind** | Fast dev server, full control, pure SPA; deploys as static to Cloudflare Pages later with no rewrite. |
| AI / backend | **Hono** server + **`@anthropic-ai/sdk`** | Tiny, fast API that runs locally on Node **and** deploys unchanged to Cloudflare Workers/Pages Functions — perfect for "local now, deploy later." Keeps `ANTHROPIC_API_KEY` server-side. |
| Models | `claude-sonnet-4-6` for valuation reasoning + chat; option to drop chat to `claude-haiku-4-5-20251001` for cost | Sonnet = best quality/price for reasoning; Haiku for high-volume chat. |
| Leads store | local **SQLite** → Cloudflare **D1** on deploy | Zero setup locally; clean migration path. |
| Seed data | listings + suburbs scraped once from his **public** site | Real listings make the demo credible. Public pages only. |

> **Invoke skills while building** (full table in CLAUDE.md): **frontend-design** before any UI, **claude-api** before any Anthropic SDK code, **run** + **verify** to test locally, **code-review** + **security-review** before going live (handles PII + an API key).
>
> **Operating rules:** (1) **no execution without an explicit command** — plan/propose first, then wait for the go-ahead; (2) **ask clarifying questions until ~95% confidence** before acting on anything ambiguous.

---

## Project structure

```
manifest-companion/
  web/                       # Vite + React front-end (the microsite)
    src/
      routes/                # Landing, Valuation pages
      components/
        Hero.tsx, ListingCard.tsx
        ValuationForm.tsx     # -> POST /api/valuation, then /api/lead
        ConciergeWidget.tsx   # floating chat bubble + panel (streams /api/chat)
      lib/api.ts             # fetch wrappers to the Hono API
  api/                       # Hono server
    src/
      index.ts               # routes: /api/valuation, /api/lead, /api/chat
      anthropic.ts           # SDK client + shared system prompts
      leads.ts               # SQLite read/write
      data.ts                # loads seeded listings/suburbs
  data/
    listings.json            # seeded from his public site (one-off scrape)
    suburbs.json             # suburb medians/notes
    leads.db                 # SQLite (gitignored)
  .env                       # ANTHROPIC_API_KEY=... (gitignored)
```

Local dev: Vite front-end on `localhost:5173`, Hono API on `localhost:8787` (Vite proxy `/api` → 8787).

---

## Phase 1 — Scaffold + design the microsite *(teaches: setup, design)*

1. `npm create vite@latest web -- --template react-ts`; add Tailwind. Init Hono in `api/` with `@anthropic-ai/sdk`.
2. **Invoke the frontend-design skill** to build a distinctive landing page that deliberately avoids the generic template look. Lean into his tagline *"where dreams meet reality"* and an inner-west-Melbourne feel.
3. Seed `data/listings.json` with a small one-off Node script reading his **public** `/buy` + `/property?...` pages. Render real `ListingCard`s.
4. `.env` + `api/src/anthropic.ts` client.

**Milestone:** polished site at `localhost:5173` with his real listings.

## Phase 2 — Instant Home Valuation *(teaches: Claude API, prompt engineering, structured JSON)*

1. `ValuationForm.tsx`: suburb dropdown (his service suburbs) + street, bed/bath/car, land/type.
2. `POST /api/valuation`: prompt Claude with subject attributes + relevant **recently-sold comps** + suburb context; return **structured JSON** `{ low, high, midpoint, confidence, rationale, comparables_used }`.
3. **Be honest in the UI:** label it an **"indicative estimate"**; CTA = *"Get an accurate appraisal from [agent]"* → the lead capture. (A true AVM needs paid sold-data; the lead is the real product.)
4. `POST /api/lead` persists name/email/phone/address + estimate to SQLite; optional email to him via a free tier.

**Milestone:** address → credible range + rationale → lead saved.

## Phase 3 — AI Buyer Concierge Chatbot *(teaches: system prompts, tool use, light RAG, streaming)*

1. `ConciergeWidget.tsx`: floating bubble → chat panel; streamed responses.
2. `POST /api/chat`: Claude with a **system prompt** scoped to Manifest RE + **current listings injected as context** (small enough to skip a vector DB initially — light RAG).
3. Claude **tools (function calling)**:
   - `search_listings(filters)` → matching seeded listings (also delivers conversational search).
   - `capture_lead(name, contact, intent)` → writes to the leads store + confirms callback/inspection.
4. Stream tokens to the UI.

**Milestone:** *"got any 3-beds under $900k near Newport?"* → real matches → books inspection → lead captured.

## Phase 4 — Polish + decide deployment *(teaches: deployment)*

1. Mobile pass, loading/empty/error states, basic API rate-limiting, simple analytics.
2. Deploy when ready: `web/` → **Cloudflare Pages**; `api/` (Hono) → **Cloudflare Workers**; `leads.db` → **D1**; secrets → CF env vars. Point a subdomain of *your* domain at it for him to trial.
3. Package the two tools as **embeddable iframe/script widgets** for later drop-in to manifestre.com.au when he gets rights.

---

## Cost reality (~$0)

- **Hosting:** $0 local; $0 on Cloudflare Pages/Workers later.
- **Claude API:** the only real cost — **pennies-to-a-few-dollars/month** at demo traffic. Use Haiku for chat. Set a spend cap in the Anthropic console.
- **Email (optional):** free tier.

---

## Verification

- Front-end at `localhost:5173`, API at `localhost:8787`; site loads with real listings.
- **Valuation:** submit address → JSON range + rationale renders; row lands in `data/leads.db` (`sqlite3 data/leads.db "select * from leads"`).
- **Chatbot:** listing question → real matches stream back; `capture_lead` persists.
- **Cost guard:** Anthropic spend limit set before sharing any link.
- **No secret leak:** `ANTHROPIC_API_KEY` never appears in browser devtools (only the Hono API calls Claude).

## Open follow-ups (not blockers)

- Decide deploy target (Cloudflare Pages/Workers vs your VM) at Phase 4.
- Optional Phase 5: **AI Listing Copy Generator** (agent-facing; great Claude-API practice).
- Source of suburb median data to ground the valuation beyond comps alone (a question for the data engineer — see one-pager).
