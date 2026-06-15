# CLAUDE.md — Manifest Real Estate AI Companion

Guidance for Claude Code working in this repo. See `docs/plan.md` for the full plan (and `docs/PROJECT_TRACKER.md` for status).

## What this is
A local-first companion site for **Manifest Real Estate** (manifestre.com.au) showcasing two AI tools the agent's WordPress template can't provide:
1. **Instant Home Valuation** — address → indicative price range (Claude over recently-sold comps) → captures a seller lead.
2. **AI Buyer Concierge Chatbot** — Claude chat over real listings + suburbs, with tool use to search listings and capture leads.

Runs locally now; deploys to Cloudflare (Pages + Workers + D1) later. No Astro.

## Stack
- **Front-end:** Vite + React + TypeScript + Tailwind (`web/`), dev on `localhost:5173`.
- **API:** Hono + `@anthropic-ai/sdk` (`api/`), dev on `localhost:8787`. Runs on Node locally, deploys unchanged to Cloudflare Workers.
- **Models:** `claude-sonnet-4-6` (valuation + chat reasoning), `claude-haiku-4-5-20251001` (cheap high-volume chat).
- **Leads:** SQLite locally (`data/leads.db`) → Cloudflare D1 on deploy.

## Operating rules (read first)
- **No execution without an explicit command.** Do not scaffold, install, run, deploy, commit, or modify files until the owner explicitly tells you to proceed. Plan and propose first; wait for the go-ahead.
- **Ask clarifying questions until you reach ~95% confidence** before acting. If requirements, scope, data sources, or approach are ambiguous, ask — do not assume. Only start work once intent is clear.

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
