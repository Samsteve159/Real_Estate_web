# Fresh_Build — Manifest Real Estate overhaul

The new build lives here. The old prototype (`../demo_theme`, `../web`, `../api`,
`../docs`) stays in place as **reference** and a source of proven code to lift.

## Structure
```
Fresh_Build/
  website/   ← the new custom React site (Vite + React + TS + Tailwind)
  app/       ← built later; reuses the same tools + API
  Assets/    ← you paste source files here (logo, newsletter MD, Excel, …)
  vault-re-api-access-email.md  ← ready-to-send email for Akshay
```

## What we're building (see ../.claude/plans for the full plan)
A premium, approachable website for first-home-buyers & early investors:

- **Milestone 1 — Live site + listings:** new design, listings auto-synced from
  the **Vault RE** CRM (create a listing in Vault → it appears on the site).
- **Milestone 2 — Tools:** Instant Valuation, Portfolio assessment, Pre-buying
  tool, VIC Stamp-duty calculator (from sro.vic.gov.au).
- **Milestone 3 — Trust engine:** Melbourne newsletter + monthly per-client
  market-update emails.

Then the companion **app**, reusing all of the above.

## Foundation decision
Custom React (not WordPress) — because Vault RE has a documented REST API, so
listing-sync is cheap, and we keep full control of the premium look + native AI
tools. Hosted on Cloudflare. Target run cost ≤ **$500/mo**.

## Next from you
1. Paste files into `Assets/` (see `Assets/README.md`).
2. Have **Akshay** send the Vault RE email (`vault-re-api-access-email.md`).
3. Confirm the GoDaddy domain name(s).
