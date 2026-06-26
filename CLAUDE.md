# CLAUDE.md — Manifest Real Estate AI Companion

Guidance for Claude Code working in this repo.
- **Current focus → the overhaul.** Plan: `~/.claude/plans/we-need-to-to-sequential-deer.md`. Living status: `Fresh_Build/PROJECT_TRACKER.md`. New build lives in `Fresh_Build/`.
- **Legacy demo** (below) stays as reference: `docs/plan.md`, `docs/PROJECT_TRACKER.md`, `demo_theme/`, `web/`, `api/`.

## Current focus — the overhaul (`Fresh_Build/`)
Full overhaul of the Manifest site for first-home-buyers / early investors / 1–2-property owners — give them broker-grade tools and build trust → leads. Three milestones:
1. **Live website + Vault RE listings** (create a listing in Vault RE → it appears on the site, via Vault RE's REST API).
2. **Client tools:** Instant Valuation, Portfolio assessment, Pre-buying tool, VIC Stamp-duty calculator, Rental yield/cash-flow tool (deterministic, from sro.vic.gov.au).
3. **Trust engine:** Melbourne newsletter (adapt the owner's existing email-approval content-bot pattern) + monthly per-client market updates. **NOT part of the website** — it's a separate engine.
Then a companion **app** reusing the same tools. Foundation: **custom React** (like `demo_theme`), built local-first / host-agnostic. Hard cap **≤ $500/mo**.

**Build progress (2026-06-25):** The new site lives in `Fresh_Build/site/` (Vite+React+TS+Tailwind, dark theme on :5180, proxies `/api`→:8787). Built: Home (motion hero + B&W skyline), Listings (mock), About, Contact (lead capture), and **all 6 client tools** — Instant Valuation, AI Concierge (floating bot + page), Stamp Duty, Pre-buying, Portfolio, Rental. Deterministic calculators verified against sources. Tools live in a 6-bucket mega-menu under the nav. Reuses the legacy `api/` (Hono) for valuation/chat/leads — the **valuation comp price/property mismatch is fixed** (`api/src/valuation.ts` `reconcileComps`). Logo recolored for black. **Blocked:** Vault RE listings + listing-detail page (awaiting Akshay's Vault API access); live AI needs Akshay's `ANTHROPIC_API_KEY` in `api/.env`.

### Design direction (LOCKED — set by Akshay)
Full brief: `Fresh_Build/Assets/design-direction-brief.md`. Non-negotiables:
- **Build the fresh site — never refine the demo.** `demo_theme` and `Fresh_Build/website` (a demo copy) are **reference only**; do not polish them. The deliverable is net-new pages + the tools.
- **Black theme, white fonts, gold accent** (`#c2a267`), Raleway. Near-black bg; navy is a deep secondary tone only.
- **Motion hero** ("moving pictures" like the references) — use **tasteful placeholder motion**, swappable for Akshay's real footage; placeholder pictures elsewhere as needed.
- **Inspiration only, NEVER copy** the reference sites (WHITEFOX Real Estate, LUXE Real Estate) — no lifting their colors/CSS/markup/assets (IP risk). Build original.
- Carries **all the tools**: Instant Valuation, AI Buyer Concierge, VIC Stamp-duty, Pre-buying, Portfolio assessment, Rental yield/cash-flow.

## Ownership & credentials (IMPORTANT)
- This is **Manifest's / Akshay's** project. **Never use Sameer's personal infrastructure** — not his domain, not his Oracle Cloud VM, not his accounts.
- Every production account (domain, hosting/VM, email/ESP, Anthropic billing, Vault RE integrator) must be **set up under Manifest / Akshay's credentials**. If a build step needs an account, use **his** identity, not Sameer's.

## What this is

> Legacy demo (kept as reference; the overhaul above supersedes the deploy/stack notes here).

A local-first companion site for **Manifest Real Estate** (manifestre.com.au) showcasing two AI tools the agent's WordPress template can't provide:
1. **Instant Home Valuation** — address → indicative price range (Claude over recently-sold comps) → captures a seller lead.
2. **AI Buyer Concierge Chatbot** — Claude chat over real listings + suburbs, with tool use to search listings and capture leads.

Runs locally now; deploys to Cloudflare (Pages + Workers + D1) later. No Astro.

## Stack
- **Front-end:** Vite + React + TypeScript + Tailwind (`web/`), dev on `localhost:5173`.
- **API:** Hono + `@anthropic-ai/sdk` (`api/`), dev on `localhost:8787`. Runs on Node locally, deploys unchanged to Cloudflare Workers.
- **Models:** `claude-opus-4-8` (valuation reasoning, `api/src/anthropic.ts` `REASONING_MODEL`), `claude-sonnet-4-6` (concierge chat, `CHAT_MODEL` — downgraded from Opus 4.8 on 2026-06-26 to cut cost ~40% while keeping tool-use + grounding quality).
- **Leads:** SQLite locally (`data/leads.db`) → Cloudflare D1 on deploy.

## Operating rules (read first)
- **No execution without an explicit command.** Do not scaffold, install, run, deploy, commit, or modify files until the owner explicitly tells you to proceed. Plan and propose first; wait for the go-ahead.
- **Ask clarifying questions until you reach ~95% confidence** before acting. If requirements, scope, data sources, or approach are ambiguous, **interrogate the owner** — do not assume. Only start work once intent is clear.
- **Keep the docs live.** Periodically (after any meaningful decision or chunk of work) update this `CLAUDE.md`, the plan, and `Fresh_Build/PROJECT_TRACKER.md` so nothing slips. The tracker is the running source of truth for what's done / next / blocked.
- **Use Manifest / Akshay's credentials for all infra** — never Sameer's domain, VM, or accounts (see Ownership & credentials above).

## IMPORTANT — invoke these skills
Always invoke the relevant skill rather than working from memory. Required and beneficial skills for this project:

| Skill | When to invoke |
|---|---|
| **frontend-design** | Before building any UI / page / component. The point is a distinctive, anti-generic "wow" look — never hand-roll generic markup. |
| **claude-api** | Before writing any Anthropic SDK / Claude API code (clients, prompts, tool-use, streaming, model IDs, pricing). Don't rely on memory for API shapes or model IDs. |
| **run** | To launch and drive the app locally (Vite front-end + Hono API) to see a change working. |
| **verify** | To confirm a change actually works end-to-end (e.g. valuation returns a range and a lead lands in the DB) before declaring it done. |
| **code-review** | To review a diff for correctness bugs and cleanups after a meaningful change. |
| **security-review** | Before going live — this app handles PII (names, contacts, addresses, chat transcripts) and a server-side API key. Run a security review of the changes. |
| **presentation-deck** | If the owner later wants a slide/pitch deck (beyond the existing `docs/pitch.html` infographic). |
| **context-mode** | When processing large command/test/scrape output, so raw data stays out of context. |
| **init** | If the project structure changes enough to warrant regenerating this CLAUDE.md. |

## Conventions
- Keep `ANTHROPIC_API_KEY` server-side only (Hono routes). It must never reach the browser bundle.
- Use only the agent's **public** pages for seeding listing data.
- Label valuations as an **"indicative estimate"** in all UI copy; the CTA drives to a real appraisal (lead capture).
- Set an Anthropic spend cap before sharing any deployed link.

## Run (once scaffolded)
- API: `cd api && npm run dev`
- Web: `cd web && npm run dev`
