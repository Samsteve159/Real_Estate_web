# Manifest Buyer App — working folder

The mobile **buyer companion / mentor app** — *"a personal buyer in your pocket."*
A standalone consumer brand **powered by Manifest Real Estate**, hand-holding a
buyer (first-home buyers first, Victoria first) through the **entire 7-stage
purchase journey** with broker-grade tools, an AI mentor, timeline / reminders /
interactive checklists, and member-only partner discounts.

> Full plan: `~/.claude/plans/the-biggest-gap-is-delegated-crane.md`

## Folder map
```
app/
  README.md          ← this file
  knowledge/         ← SINGLE SOURCE OF TRUTH (read these before any app work)
    PRODUCT.md         vision, niche, the 8 strategic answers, why-us-over-ChatGPT
    BRAND.md           name candidates, tagline, palette, type, voice
    JOURNEY.md         the 7 stages — every screen, checklist item, reminder
    TOOLS.md           every calculator — inputs, formula, source, build status
    AI-MENTOR.md       the AI assistant — prompt, tools, guardrails, paid boosts
    MONETIZATION.md    free-to-buyer model, partner network, boosts, two portals
    COMMERCIALS.md     service fee we charge the client (Akshay) — reference model, app fee TBD
    ARCHITECTURE.md    Expo stack, data model, offline/sync, backend reuse
    ROADMAP.md         phases, cost, timeline
    IDEAS.md           extra ideas that build on the owner's vision (living)
    DECISIONS.md       locked decisions + open questions (living log)
  concept/           ← visual concept preview for Akshay (app-concept.html + .pdf)
  Assets/            ← app assets (logos, footage, docs) — owner-populated
  mobile/            ← the Expo (React Native) app          [Phase 0/1 built ✅]
  core/              ← shared pure-TS calculators + journey model [built + verified ✅]
```

## Status
Phase 0 **done**, Phase 1 spine **done**: `core/` package (verified 12/12 vs SRO),
Expo app (`mobile/`) with 4 tabs, journey engine (readiness + persisted checklists),
and 3 live calculators. Typecheck + full iOS bundle both clean. Next: reminders,
remaining Stage-1 calcs, mentor streaming. See `knowledge/ROADMAP.md` + `DECISIONS.md`.

## Rule for Claude
**Re-read `knowledge/` at the start of any app work** — it's the source of truth,
kept current so there's no knowledge leakage between sessions.
