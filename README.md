# Manifest Real Estate — AI Companion

A local-first companion site for **Manifest Real Estate** (manifestre.com.au) showcasing two AI tools:

1. **Instant Home Valuation** — address + attributes → indicative price range (Claude over recently-sold comps) → captures a seller lead.
2. **AI Buyer Concierge** — a streaming chatbot over real listings + suburbs, with tool use to search listings and capture buyer leads.

> Indicative estimates only — the CTA drives to a real appraisal. See `plan.md` for the full plan and `CLAUDE.md` for working guidance.

## Structure

```
.
├── web/        Vite + React + TypeScript + Tailwind front-end  (localhost:5173)
│   └── src/
│       ├── routes/        page-level views
│       ├── components/     UI building blocks
│       └── lib/            API fetch wrappers
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
├── scripts/
│   └── scrape-listings.mjs  one-off public-site scraper (pure fetch, no LLM, $0)
├── pitch.html / one-pager.html   existing infographics
└── plan.md / CLAUDE.md
```

## Refreshing listings

`data/listings.json` is scraped from Manifest's **public** pages. To re-sync the
current stock (no API cost — plain HTML parsing, polite rate):

```bash
node scripts/scrape-listings.mjs   # rewrites data/listings.json; restart the API after
```

## Run locally

Both processes run side by side. The web dev server proxies `/api` → the Hono API.

```bash
# 1. API (terminal 1)
cd api && npm install && npm run dev      # http://localhost:8787

# 2. Web (terminal 2)
cd web && npm install && npm run dev      # http://localhost:5173
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

`web/` → Cloudflare Pages · `api/` (Hono) → Cloudflare Workers · `leads.db` → D1. The Hono API runs unchanged on Node locally and on Workers.
