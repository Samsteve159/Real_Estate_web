# Manifest website (Fresh_Build)

The new Manifest Real Estate site. Vite + React + TS + Tailwind, scaffolded from
the proven `../../demo_theme` baseline.

## Run
```
npm install
npm run dev      # http://localhost:5175  (proxies /api -> the Hono API on :8787)
```
Start the API too (from repo root): `cd api && npm run dev`.

## Layout
- `src/index.css` — Tailwind `@theme` design tokens (navy `#003970` / gold `#c2a267`, Raleway).
- `src/components/` — Nav, Hero, Footer, ListingCard, tool widgets, etc.
- `src/routes/` — pages + chrome-less `/embed/*` routes.
- `src/lib/api.ts` — typed API client.
- `public/` — `manifest-logo.png`, `embed.js`.

## Status / next
- ✅ Running Manifest-branded baseline (valuation + concierge lifted from demo_theme).
- ⬜ Design elevation pass (whitefox/luxhabitat direction) — next, via the `manifest-ui` agent.
- ⬜ Real listings via Vault RE (`vault-integrator`).
- ⬜ New tools: portfolio, pre-buying, VIC stamp duty (`calc-verifier`).

See `../PROJECT_TRACKER.md` and `~/.claude/plans/we-need-to-to-sequential-deer.md`.
