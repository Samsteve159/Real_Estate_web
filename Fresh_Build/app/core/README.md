# @manifest/core

Shared, **framework-agnostic** logic for the buyer app — no React, no DOM.
Consumed by the Expo app (`../mobile`) and reusable by the website.

## Contents (`src/`)
- **Calculators** (deterministic, source-cited — ported from the proven website):
  `stampDuty.ts` · `preBuying.ts` · `rental.ts` · `portfolio.ts`
- **`types.ts`** — API/domain contract (valuation, lead, chat, suburb) shared with `api/`.
- **`journey.ts`** — the typed 7-stage journey model + canonical stage/checklist data
  (`STAGES`, `readinessScore()`); copy source of truth is `knowledge/JOURNEY.md`.
- **`index.ts`** — barrel; import everything from `@manifest/core`.

## Verified
Calculator anchors cross-checked against SRO Victoria (12/12 passing):
`generalDuty($600k)=$31,070` · `pprDuty($500k)=$21,970` · `FHB $600k=$0` ·
`FHB $650k=$11,356.67` · foreign duty 8%. Re-run: `npx tsx <verify script>`.

## Notes
- `formatAUD()` uses `Intl` (`toLocaleString`) — fine on Hermes; swap a manual
  formatter if a target runtime lacks Intl.
- Pure ESM, no dependencies. The Expo app consumes it via Metro `watchFolders`.
