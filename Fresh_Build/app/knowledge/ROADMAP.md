# ROADMAP — phases, cost & timeline

All estimates are Claude-Code-assisted and indicative; refined as we build.

## Build phases
| Phase | What | Est. |
|---|---|---|
| 0 | Knowledge base + Expo scaffold + design system + shared `core/` — **✅ DONE** | ~1 wk |
| 1 | Stage-1 tools + journey engine shell (timeline/checklists/reminders) — **🟡 in progress** | ~2–3 wks |
| 2 | AI mentor + remaining calculators (calc-verifier gated) | ~2 wks |
| 3 | Stage-2 "find a property" + data sourcing (overlays/comps/catchments) | ~2–3 wks |
| 4 | Curated partner directory + Stages 3–7 checklists + polish | ~2 wks |
| 5 | Store assets + TestFlight / Play beta + submission | ~1 wk |

- **Beta (TestFlight / Play) in ~4–5 weeks** — Stages 1–2 + tools + mentor.
- **Polished v1 in ~10–12 weeks.**
- **v2 (business/partner portal + paid boosts + referral tracking)** — a separate
  phase after buyers exist.

## Running cost (target ≤ $500/mo)
| Line | Cost |
|---|---|
| Anthropic API (mentor + valuation) | variable, gated by Manifest workspace spend cap |
| Apple Developer Program | $99 / yr |
| Google Play Console | $25 one-time |
| Backend hosting (GoDaddy Node / small VPS) | ~$10–20 / mo |
| Push notifications (Expo) | free |
| Premium property data (Domain/CoreLogic) | **deferred** — the only line that threatens the cap |

Net: comfortably under $500/mo in v1 **as long as premium property data stays deferred**
to a paid tier. Free VIC gov data + curated comps + AI valuation cover Stage 2 at launch.

## Milestones to show Akshay
1. **Concept preview** (this session — `app/concept/app-concept.html`).
2. Clickable Expo prototype of Stage 1 + one tool + the mentor (end of Phase 1).
3. Private beta on his phone (Phase 5 beta).

## Key risks
- **Property data cost/availability** for Stage 2 (mitigated: free gov data first).
- **App-store review** (esp. Apple) — plan for financial-tool disclaimers + privacy.
- **Trust bar** — every number must cite a source or it undermines the whole promise.
- **Brand name / trademark** availability (see DECISIONS.md).
