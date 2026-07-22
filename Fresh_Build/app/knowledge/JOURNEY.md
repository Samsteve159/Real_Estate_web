# JOURNEY — the 7-stage engine

The spine of the app: a persistent, per-user journey with **timeline, reminders and
interactive checklists.** Progress is saved locally (works offline). Each stage
unlocks the next but all tools stay accessible any time. Every checklist item can
carry a due date → a push reminder; every "book/connect" item routes to a partner
(discount) or a human.

Legend: `[calc]` = calculator (see TOOLS.md) · `[list]` = interactive checklist ·
`[data]` = needs property/gov data · `[partner]` = partner referral/discount ·
`[ai]` = AI mentor assist · `[human]` = one-tap to a Manifest expert.

---

## Stage 1 — Get Ready  ("Can I afford it, and what's my budget?")
- Borrowing capacity `[calc]`
- Deposit calculator `[calc]`
- Stamp duty calculator `[calc]` (VIC, exact — SRO)
- Budget planner `[calc]`
- Savings tracker `[calc][list]` (goal + progress over time)
- Grants & concessions check `[calc]` (FHOG, stamp-duty concession — auto from inputs)
- Connect to a broker `[partner][human]`
- **Buyer Readiness Score** (our addition) — a single confidence meter that fills as
  Stage-1 items complete. Gamifies "getting ready".

## Stage 2 — Find a Property  ("Is this the right one, and is it fairly priced?")
- Inspection checklist `[list]` (on-site: photos, voice notes, GPS-tag the property)
- Questions to ask the agent `[list][ai]` (auto-tailored to the listing)
- Comparable sales `[data][ai]`
- Suburb score `[data]`
- School catchments `[data]` (findmyschool.vic.gov.au)
- Flood / fire overlays `[data]` (VIC planning overlays)
- Development overlays `[data]`
- Estimated rental yield `[calc]`
- Estimated resale value `[ai]` (indicative, cites comps)
- **Shortlist compare** (our addition) — save several properties, compare side-by-side.

## Stage 3 — Before Making an Offer  ("How do I not overpay or get burned?")
- Offer strategy `[ai]`
- Auction strategy `[ai]` + **Auction-day companion** (walk-away price, live bid calc)
- Recommended offer range `[ai][data]`
- Due-diligence checklist `[list]`
- Building inspection booking `[partner]`
- Pest inspection booking `[partner]`
- Conveyancer selection `[partner][human]`
- Finance-clause explanation `[ai]`

## Stage 4 — Under Contract  ("Am I on track to settlement?")
Progress tracker `[list]` with reminders on each:
✔ Contract signed · ✔ Deposit paid · ✔ Finance approved · ✔ Building inspection
complete · ✔ Pest inspection complete · ✔ Section 32 reviewed `[ai]` · ✔ Settlement
booked · ✔ Utilities organised `[partner]` · ✔ Insurance arranged `[partner]`

## Stage 5 — Final Inspection  ("Is the home as promised?")
Interactive checklist `[list]` (photo capture on each):
Appliances working · Heating/cooling · Hot water · Lights · Garage door · Keys ·
Damage since inspection · Fixtures included (per contract) · Photos uploaded.

## Stage 6 — Settlement  ("Getting the keys.")
- Settlement status tracker `[list]`
- Bank updates · Conveyancer updates `[human]`
- Key collection
- Utility transfers `[partner]`

## Stage 7 — After Settlement  ("I've moved in — now what?")
- Address-change reminders `[list]` (council rates, water authority, insurance, licence)
- Maintenance schedule `[list]` (seasonal reminders)
- Property value tracker `[data]` (equity over time)
- **Refinance / equity nudges** (our addition) — re-engagement + broker lead down the line
- Invite-a-friend referral `[partner]`

---

## Journey engine requirements
- **Local-first store** of stage/checklist/reminder state (offline-capable).
- **Reminders** via push notifications tied to real dates the buyer enters
  (settlement, inspection, cooling-off end).
- **Document vault** (our addition) — store contract, Section 32, building report,
  receipts in-app; these also feed the AI mentor ("summarise this report").
- **Human handoff** — any `[human]` tap creates a qualified lead to Manifest.
- **Progress persistence** across app restarts; optional cloud sync later.
