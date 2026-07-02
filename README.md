# Manifest Real Estate — AI Companion

A local-first companion site for **Manifest Real Estate** (manifestre.com.au) showcasing two AI tools:

1. **Instant Home Valuation** — address + attributes → indicative price range (Claude over recently-sold comps) → captures a seller lead.
2. **AI Buyer Concierge** — a streaming chatbot over real listings + suburbs, with tool use to search listings and capture buyer leads.

> Indicative estimates only — the CTA drives to a real appraisal. See `legacy/docs/plan.md` for the full plan and `CLAUDE.md` for working guidance.

> **Repo layout (2026-07-02):** active work is in **`Fresh_Build/`** (see `CLAUDE.md`). The original prototype this README documents is now archived under **`legacy/`** (`legacy/web`, `legacy/demo_theme`, `legacy/docs`, `legacy/scripts`). **`api/`** and **`data/`** stay at the repo root — they're still used live by `Fresh_Build/`.

## Structure

```
.
├── legacy/web/        Vite + React + TypeScript + Tailwind front-end  (localhost:5173)
│   └── src/
│       ├── routes/        page-level views
│       ├── components/     UI building blocks
│       └── lib/            API fetch wrappers
├── legacy/demo_theme/ Copy of web/ re-skinned to Manifest's live brand (localhost:5174)
│                navy/gold + Raleway + real logo; theme-only change via @theme tokens
├── api/        Hono + @anthropic-ai/sdk server                 (localhost:8787)
│   └── src/
│       ├── index.ts        routes: /api/valuation, /api/lead, /api/chat, …
│       ├── anthropic.ts     SDK client + model IDs
│       ├── valuation.ts     instant-valuation reasoning
│       ├── chat.ts          concierge tool-use loop
│       ├── data.ts          loads seeded listings/suburbs/sold
│       └── leads.ts         SQLite read/write
├── data/       Listing/suburb data + leads DB
│   ├── listings.json        REAL current listings (scraped from his public site)
│   ├── listings.seed.json   original representative fallback
│   ├── suburbs.json         suburb medians + context (valuation service area)
│   ├── sold.json            recently-sold comparables (valuation grounding)
│   └── leads.db             SQLite (gitignored)
├── legacy/scripts/
│   └── scrape-listings.mjs  one-off public-site scraper (pure fetch, no LLM, $0)
├── legacy/docs/       Documentation & shareable artifacts
│   ├── plan.md              full build plan
│   ├── PROJECT_TRACKER.md   phased delivery tracker
│   ├── pitch.html           business pitch (infographic)
│   ├── one-pager.html       technical one-pager
│   ├── progress.html        build-status dashboard
│   ├── once_deployed.html   preview: the AI tools embedded on the live site
│   ├── embed-demo.html      working embeddable-widgets demo
│   └── cost.html            AI + hosting running-cost sheet (hybrid model options)
├── README.md
└── CLAUDE.md   working guidance for Claude Code
```

## Refreshing listings

`data/listings.json` is scraped from Manifest's **public** pages. To re-sync the
current stock (no API cost — plain HTML parsing, polite rate):

```bash
node legacy/scripts/scrape-listings.mjs   # rewrites data/listings.json; restart the API after
```

## Run locally

Both processes run side by side. The web dev server proxies `/api` → the Hono API.

```bash
# 1. API (terminal 1)
cd api && npm install && npm run dev      # http://localhost:8787

# 2. Web (terminal 2)
cd web && npm install && npm run dev      # http://localhost:5173
```

### Manifest-branded variant (optional)

`demo_theme/` is the same app re-skinned to Manifest's live brand. Run it alongside
`web/` (both share the API):

```bash
cd legacy/demo_theme && npm install && npm run dev   # http://localhost:5174
```

### API key

The valuation and chat endpoints call Claude. Copy the example env and add your key:

```bash
cp .env.example .env        # then edit ANTHROPIC_API_KEY
```

`ANTHROPIC_API_KEY` is read **server-side only** (in `api/`) and never reaches the browser bundle. Set an Anthropic spend cap before sharing any deployed link.

## Models

- `claude-opus-4-8` — valuation reasoning + concierge chat (see `api/src/anthropic.ts`). Capability floor is Opus 4.8.

## Inspecting leads

```bash
sqlite3 data/leads.db "select * from leads order by id desc;"
```

## Deploy (later)

Target is a **VM** (local-first until the owner is happy). The Node + Hono + SQLite
stack ports directly — needs a process manager + a reverse proxy with SPA fallback
(including the `/embed/*` routes) and the env vars `ALLOWED_ORIGINS` / `STATS_TOKEN`.
See `legacy/docs/PROJECT_TRACKER.md` for the current status.
