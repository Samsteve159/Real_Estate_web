# CLAUDE.md — Manifest Real Estate AI Companion

Guidance for Claude Code working in this repo.
- **Current focus → the overhaul.** Plan: `~/.claude/plans/we-need-to-to-sequential-deer.md`. Living status: `Fresh_Build/PROJECT_TRACKER.md`. New build lives in `Fresh_Build/`.
- **Legacy demo** (below) stays as reference: `legacy/docs/plan.md`, `legacy/docs/PROJECT_TRACKER.md`, `legacy/demo_theme/`, `legacy/web/`, `api/`.

## Current focus — the overhaul (`Fresh_Build/`)
Full overhaul of the Manifest site for first-home-buyers / early investors / 1–2-property owners — give them broker-grade tools and build trust → leads. Three milestones:
1. **Live website + Vault RE listings** (create a listing in Vault RE → it appears on the site, via Vault RE's REST API).
2. **Client tools:** Instant Valuation, Portfolio assessment, Pre-buying tool, VIC Stamp-duty calculator, Rental yield/cash-flow tool (deterministic, from sro.vic.gov.au).
3. **Trust engine:** Melbourne newsletter (adapt the owner's existing email-approval content-bot pattern) + monthly per-client market updates. **NOT part of the website** — it's a separate engine.
Then a companion **app** reusing the same tools. Foundation: **custom React** (like `legacy/demo_theme`), built local-first / host-agnostic. Hard cap **≤ $500/mo**.

**Build progress (2026-06-30):** The new site lives in `Fresh_Build/site/` (Vite+React+TS+Tailwind, dark theme on :5180, proxies `/api`→:8787). Built: Home (motion hero, neutral near-black — blue tint removed; headline **"Make your next move / with Conviction"** — "Conviction" is a gold-gradient word that settles + shimmers; the skyline SVG now has ~548 warm **lit windows**), Listings (mock), About, Contact (lead capture), and **all 6 client tools** — Instant Valuation, AI Concierge (floating bot + page), Stamp Duty, **Borrowing Capacity Calculator** (renamed from Pre-buying), Portfolio, Rental. Deterministic calculators verified against sources; **all sliders are now text boxes**. Tools live in a 6-bucket mega-menu; plus a **"First home buyers" nav dropdown** → a 7-step buyer-journey page (`/first-home-buyers/steps`) and a curated buyer-tools page (`/first-home-buyers/tools`). Borrowing Capacity has an **"Email me my report" lead-capture CTA**; a brand-styled **sample report** (HTML + PDF) lives in `Fresh_Build/Assets/`. **Akshay is branded "AK"** in casual CTAs (full name "Akshay Kapoor (AK)" on About; review quotes verbatim); the Borrowing Capacity CTA is "Speak to a RE representative". **Every route opens at the top** (`Shell.tsx` scroll-to-top on path change); the **mobile menu's** Listings/About/Contact are gold→white-on-hover. Logo = original badge recolored to **brand navy `#003970`** (gold accents kept), 116px, in a 128px header. Reuses the legacy `api/` (Hono) for valuation/chat/leads — the **valuation comp price/property mismatch is fixed** (`api/src/valuation.ts` `reconcileComps`). **Preview:** GitHub Pages at https://samsteve159.github.io/Real_Estate_web/ — **now serves V2** (repointed 2026-07-02; V1 no longer deployed). Static, so **no `/api` there**: valuation/concierge/lead+report forms no-op; deterministic tools + steps page work. **Blocked:** Vault RE listings + listing-detail page (awaiting Akshay's Vault API access); live AI needs the `ANTHROPIC_API_KEY` in the **repo-root `.env`** (loaded by `api/src/anthropic.ts` via dotenv — not `api/.env`).

**V2 — agency repositioning (2026-07-02):** Per Akshay's feedback (`Fresh_Build/Assets/akshay-feedback-2026-07-02.md`), a repositioned build lives in **`Fresh_Build/site-v2/`** (moved there 2026-07-02; dev on **:5181**; V1 stays in `Fresh_Build/site/` on :5180 for backtracking). Reframes Manifest as a **boutique full-service agency + advisory** with **evergreen** copy (no live-market language). Nav → Home · Listings · **Services** mega-menu · About · Contact. Five evergreen service pages (Residential Sales, Acreage & Lifestyle, Development Projects, Commercial Leasing, Property Advisory) via a shared `ServicePage.tsx`; Home hero swapped to "Property. Opportunity. Results." (motion kept). The 6 tools + first-home-buyer journey are **kept, relocated under Property Advisory**. Brand kept **"Manifest Real Estate"**. **Feedback rounds 2–3 applied + deployed (2026-07-02):** service-page copy edits (Dev Projects adds "08 Coordinating Finance / 09 Exit Strategy" + "residential and commercial sites"; Residential "First Home Buyer Sales"; Commercial "Blue Chip Tenant Sourcing"; Property Advisory trimmed to 6 areas); a **hidden `RecentProjects.tsx`** showcase on Dev Projects + Commercial Leasing (`SHOW=false`); About reworked — enlarged **"Meet the Directors"**, photos moved below names at equal width, **Rishi headshot re-cropped** (800×800) + tone-matched, both **real Rishi reviews** added (Home `TrustBand` now shows per-director review blocks); Contact split into **separate Phone/Email** + address removed + Servicing "Victoria"; **inner-page top padding 6→9rem** (was hiding under the 128px header) and **mobile menu** capped to viewport so About/Contact stay reachable. **V2 is LOCKED (2026-07-03)** — Akshay signed off on the deployed V2 as the chosen build; V1 (`Fresh_Build/site/`) is archived reference only, no more backtracking. Latest local change: the Instant Valuation "Reading the comparable sales…" text swapped for an on-brand **gold spinner** (`site-v2/src/routes/ValuationPage.tsx`). **Still open for Akshay:** brand name ("Manifest Deal"?) and an **Insights** page (named, no copy yet). **Remaining blocker for a fully live site = the MRI/Vault RE integration** (Sameer registering as an approved integrator → Akshay generates an access token) + hosting the `api/` on GoDaddy so the AI tools work on the deployed URL. Details: `Fresh_Build/PROJECT_TRACKER.md` (V2 section).

### Design direction (LOCKED — set by Akshay)
Full brief: `Fresh_Build/Assets/design-direction-brief.md`. Non-negotiables:
- **Build the fresh site — never refine the demo.** `legacy/demo_theme` and `Fresh_Build/_reference` (a demo copy) are **reference only**; do not polish them. The deliverable is net-new pages + the tools.
- **Black theme, white fonts, gold accent** (`#c2a267`), Raleway. Near-black bg; navy is a deep secondary tone only.
- **Motion hero** ("moving pictures" like the references) — use **tasteful placeholder motion**, swappable for Akshay's real footage; placeholder pictures elsewhere as needed.
- **Inspiration only, NEVER copy** the reference sites (WHITEFOX Real Estate, LUXE Real Estate) — no lifting their colors/CSS/markup/assets (IP risk). Build original.
- Carries **all the tools**: Instant Valuation, AI Buyer Concierge, VIC Stamp-duty, Pre-buying, Portfolio assessment, Rental yield/cash-flow.

## Ownership & credentials (IMPORTANT)
- This is **Manifest's / Akshay's** project. **Never use Sameer's personal infrastructure** — not his domain, not his Oracle Cloud VM, not his accounts.
- Every production account (domain, hosting/VM, email/ESP, Anthropic billing, Vault RE integrator) must be **set up under Manifest / Akshay's credentials**. If a build step needs an account, use **his** identity, not Sameer's.

## Billing, hosting & invoicing (workspace LIVE 2026-07-03)
Full plan: `~/.claude/plans/flickering-purring-cat.md`.
- **✅ Anthropic Console Workspace ("bucket") is LIVE (2026-07-03).** Sameer created the Workspace **"Manifest Real Estate"** with its own API key + monthly spend limit; the new workspace key is swapped into the **repo-root `.env`** (`ANTHROPIC_API_KEY`, replacing the old dev key). **Verified end-to-end:** `/api/valuation` → 200 (real $830k–$920k range + 3 comparables + rationale) and `/api/chat` concierge → 200 SSE streaming, both billing to the Manifest bucket. Spend attributed per-project via the Console **Cost dashboard** + **Admin API cost report** (needs a separate `sk-ant-admin…` admin key for the future invoice script). **Credit balance + auto-reload are org-level, not per-workspace.** Org auto-top-up is **capped at $50** (Akshay pre-paid AUD 20 for the chatbot + instant-valuation tools).
- **GoDaddy hosting (2026-07-03, in planning).** Production moves to a **Manifest-owned GoDaddy** account. The static site runs on any cPanel plan; the **`api/` backend needs a plan that supports Node.js** (cPanel "Setup Node.js App" / CloudLinux) — GoDaddy shared-hosting Node support is inconsistent, so **verify before/at purchase** (30-day money-back covers a wrong pick → VPS fallback). Deluxe (~$9/mo, free domain 1st yr) is the leading candidate. Plan: Akshay buys under Manifest → shares cPanel/SSH → Claude inspects the environment, confirms Node support (or upgrade path), then deploys site + API + domain + SSL so Akshay gets a live working site. Spend is then attributed per-project in the Console **Cost dashboard** (filter by workspace) and the **Admin API cost report** (grouped by workspace; needs a separate `sk-ant-admin…` admin key). **Credit balance + auto-reload are org-level, not per-workspace** — attribution comes from the cost report, not earmarked credit. Org auto-top-up is **capped at $50** (Akshay pre-paid AUD 20 for the chatbot + instant-valuation tools).
- **Interim ownership reality:** despite the "use Akshay's credentials" rule above, for now this runs on **Sameer's** Anthropic org and **GitHub** (Pages/Actions is interim only), and **Sameer invoices Akshay for reimbursement**. **Production hosting moves to GoDaddy** later; the invoicing job ports from a GitHub Actions cron to a **GoDaddy cPanel cron** with no code change (state file on disk instead of a git commit). Akshay reimburses **both** the Anthropic API usage **and** the GoDaddy hosting fee.
- **Auto-invoicing (planned, deferred until the workspace/keys exist):** a host-agnostic Node script `Fresh_Build/tools/invoice.mjs` reads the Manifest workspace cost via the Admin API and, **each time the workspace's own usage crosses a threshold** (e.g. $20/$50), generates a brand-styled invoice + emails it to Akshay (ESP + his invoicing address TBD), tracking a baseline in `invoice-state.json`. Anthropic has **no webhook for top-ups** and a top-up is org-wide, so invoicing keys off **Manifest usage**, never the top-up event; invoice can bundle a fixed hosting line.

## What this is

> Legacy demo (kept as reference; the overhaul above supersedes the deploy/stack notes here).

A local-first companion site for **Manifest Real Estate** (manifestre.com.au) showcasing two AI tools the agent's WordPress template can't provide:
1. **Instant Home Valuation** — address → indicative price range (Claude over recently-sold comps) → captures a seller lead.
2. **AI Buyer Concierge Chatbot** — Claude chat over real listings + suburbs, with tool use to search listings and capture leads.

Runs locally now; deploys to Cloudflare (Pages + Workers + D1) later. No Astro.

## Stack
- **Front-end:** Vite + React + TypeScript + Tailwind (`legacy/web/`), dev on `localhost:5173`.
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
| **presentation-deck** | If the owner later wants a slide/pitch deck (beyond the existing `legacy/docs/pitch.html` infographic). |
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
