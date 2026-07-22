# ARCHITECTURE — stack & data

## Stack (as built — Phase 0/1)
- **Expo SDK 57, React Native 0.86, TypeScript** — iOS + Android from one codebase.
- **expo-router** — file-based routing (`app/(tabs)` + `app/tools/*` + `app/stage/[id]`).
- **Styling: a typed theme module (`src/theme.ts`) + `StyleSheet`**, reusing the V2
  tokens verbatim (BRAND.md). *Chose this over NativeWind for reliability on the very
  new SDK 57 — NativeWind can be revisited later.* Reanimated + worklets installed for motion.
- **expo-notifications** — reminders/timeline push (wiring in Phase 1 remainder).
- **Local-first storage** — AsyncStorage now (`src/lib/journeyStore.tsx`, key
  `manifest.journey.v1`); `expo-sqlite` later if needed. **No mandatory login in v1.**

> **Shared core:** `app/core` is the canonical package (verified). The app bundles a
> **vendored copy** at `mobile/src/core`, aliased as `@manifest/core` (Metro +
> tsconfig). Sync after editing core: `node scripts/sync-core.mjs`. *(Vendored because
> Metro's cross-package linking to a sibling TS source folder was brittle.)*

## Reuse map (verified by inventory)
- **Calculators** → `Fresh_Build/site-v2/src/lib/{stampDuty,preBuying,rental,portfolio}.ts`
  are **pure TS, zero DOM/React** → port into `app/core/`. Only `formatAUD` uses
  `toLocaleString` (fine on Hermes Intl, or swap a manual formatter).
- **Backend** → reuse the existing Hono **`api/`** unchanged. The app just calls it.
  - Plain endpoints (`/api/valuation`, `/api/lead`, `/api/listings`, `/api/suburbs`)
    port directly — swap `import.meta.env.VITE_API_BASE` for an **Expo config constant**
    pointing at the absolute API URL (no dev proxy in RN).
  - `/api/chat` is **SSE streaming** — the browser `ReadableStream` reader needs an
    **RN-compatible streaming fetch** (`react-native-sse` or `expo/fetch` streaming).
  - Model IDs today: valuation `claude-opus-4-8`, chat `claude-sonnet-4-6` (confirm via
    claude-api skill at build).
- **Types** (`ValuationRequest/Result`, `LeadPayload`, `ChatMessage/Event`, `Suburb`)
  → copy into `app/core/` so app + api share the contract.

## New backend surface (small)
- **Partner directory** endpoint — static/curated JSON in v1 (no new infra).
- Mentor tool endpoints (`run_calculator`, `get_property_data`, `explain_clause`,
  `summarise_document`) — extend `api/src/chat.ts`.
- (v2) accounts + partner portal + referral tracking → needs a real DB (Postgres/D1)
  and auth. Out of v1 scope.

## Data sources (Stage 2 — the hard part)
VIC-first, free-gov-first to protect the cost cap:
- **Planning overlays** (flood/fire/development) → Vicplan / DELWP.
- **School zones** → findmyschool.vic.gov.au.
- **Base map / parcels** → Vicmap.
- **Comparable sales / sold data** → premium (Domain API / CoreLogic — expensive);
  **v1 = curated comps + the existing AI valuation**; premium sold-data = a later paid tier.

## Hosting
Backend `api/` runs on Node → target the Manifest **GoDaddy** Node plan (or a small VPS
fallback). Static/marketing web can sit on GitHub Pages interim. Everything ≤ $500/mo.

## Offline & privacy
- Journey state and the document vault live **on-device**; work offline.
- Documents only leave the device for the specific AI action the user requests.
- Minimal PII; leads are explicit, user-initiated actions.
