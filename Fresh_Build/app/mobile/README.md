# mobile — Manifest Buyer App (Expo)

Expo SDK 57 · React Native 0.86 · TypeScript · expo-router. Dark + gold brand
(`src/theme.ts`, from `../knowledge/BRAND.md`). Working name "Manifest Buyer".

## Run
```bash
npm install          # first time (uses .npmrc legacy-peer-deps)
npm run start        # Metro; press i (iOS) / a (Android)
npm run typecheck    # tsc --noEmit
```
Point the app at the backend with `EXPO_PUBLIC_API_BASE` (defaults: iOS sim
`localhost:8787/api`, Android emu `10.0.2.2:8787/api`). Run the API from repo `api/`.

## Structure
```
app/                 expo-router routes
  _layout.tsx        providers (JourneyProvider, SafeArea, dark Stack)
  (tabs)/            Journey · Tools · Mentor · Perks
  stage/[id].tsx     stage detail — interactive checklist (persisted)
  tools/             stamp-duty · borrowing · rental  (wired to @manifest/core)
src/
  theme.ts           brand tokens (colors/spacing/type)
  components/ui.tsx   design-system primitives
  lib/               config · api · format · journeyStore (AsyncStorage)
  core/              VENDORED copy of ../core (see below)
scripts/sync-core.mjs  refresh src/core from the canonical ../core
```

## Shared calculators (`@manifest/core`)
Canonical source is **`../core`** (verified against SRO anchors). The app bundles a
**vendored copy** in `src/core`, aliased `@manifest/core` via `metro.config.js` +
`tsconfig.json`. **After editing `../core/src`, run `node scripts/sync-core.mjs`.**

## Status
Phase 0 done; Phase 1 spine done (journey engine + 3 calculators). Typecheck clean;
full iOS bundle exports clean. Next: reminders, remaining Stage-1 calcs, mentor
streaming. See `../knowledge/ROADMAP.md` + `DECISIONS.md`.
