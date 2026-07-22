# DECISIONS — locked & open (living log)

## Locked (2026-07-21, with owner)
- **Tech:** Expo (React Native + TypeScript), iOS + Android. Reuse the pure-TS V2
  calculators + the existing Hono `api/` backend.
- **Brand:** a **standalone new consumer brand, powered by Manifest Real Estate**
  (national ambition; Manifest = credibility + lead destination).
- **Target v1:** **first-home buyers** (wedge). Expand to investors/upgraders later.
- **Scope v1:** **buyer app first**; partner perks curated/manual; the self-serve
  **business/partner portal + paid AI boosts + referral tracking = v2** (two portals).
- **Geography v1:** **Victoria first** (matches existing VIC calculators/overlays).
- **Knowledge base:** md files in `app/knowledge/` are the single source of truth;
  re-read them at the start of any app work (no knowledge leakage).

## Open (need Akshay's input)
1. **Brand name + final tagline** — see candidates in `BRAND.md`. Check app-store +
   trademark availability before locking.
2. **Premium property-data source & budget** for Stage 2 (free gov data vs Domain/
   CoreLogic). Affects cost cap and Stage-2 depth.
3. **Accounts/cloud sync in v1?** — recommendation: local-first, optional account later.
4. **Seed partners** for the curated v1 directory (Akshay's real building & pest,
   conveyancer, broker, insurance contacts).
5. **Paid-boost pricing** (1-day / 1-week / 1-month) and which AI features are gated.
6. Confirm the **illustrative stats** ("100+ clients", "8 yrs") before public use.
7. **App service fee** — the costing element **Akshay will set** (once-off vs monthly
   + amount). Reference model = website ($161/mo or $1,800 once-off). See `COMMERCIALS.md`.

## Decision log
- 2026-07-21 — App phase kicked off; four strategic forks decided (above).
- 2026-07-21 — Reusability inventory confirmed all 4 calculators are portable pure TS;
  backend reused as-is (SSE reader + `import.meta.env` are the only RN swaps).
- 2026-07-22 — Knowledge base drafted + concept preview created for Akshay.
- 2026-07-22 — Added `COMMERCIALS.md`: client service-fee model (website reference:
  $161/mo or $1,800 once-off); app service fee TBD by Akshay. Kept separate from the
  buyer-facing free model in `MONETIZATION.md`.
- 2026-07-22 — **Phase 0 built + Phase 1 spine.** `app/core` package (calculators +
  types + journey model) — **verified 12/12 against SRO anchors**. Expo SDK 57 app
  (`app/mobile`): 4 tabs (Journey/Tools/Mentor/Perks), journey dashboard with readiness
  score, per-stage interactive checklists (local-persisted via AsyncStorage), and 3 live
  calculators (stamp duty, borrowing, rental) wired to core. **Typecheck 0 errors; full
  iOS Metro bundle exports clean.** Decisions: (a) StyleSheet+theme over NativeWind for
  SDK-57 reliability; (b) core vendored into `mobile/src/core` (sync script) due to Metro
  cross-package linking; (c) no custom babel config — `babel-preset-expo` auto-handles
  worklets. **Not yet:** visual run in a simulator; reminders; remaining Stage-1 calcs;
  mentor streaming (Phase 2).
