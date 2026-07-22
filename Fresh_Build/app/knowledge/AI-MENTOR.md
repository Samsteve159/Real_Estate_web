# AI-MENTOR — the buyer's advocate assistant

## What it is
A conversational **buyer's advocate** available throughout the journey. It answers the
scary questions a first-home buyer is too embarrassed to ask an agent (who works for
the seller anyway). It's grounded, cites sources, and hands off to a human for
anything high-stakes.

## Questions it answers (owner's list)
- "Is this property overpriced?" → grounded in comparable sales `[data]`
- "Explain this contract clause." → plain-English + red-flag detection
- "What questions should I ask [at this inspection]?" → tailored to the listing
- "Summarise this building report." → document upload → key issues + costs
- "Estimate renovation costs." → indicative ranges
- "Negotiate an offer strategy." → offer/auction tactics for *this* property
- "What risks do you see?" → overlays, comps, contract, finance risks in one view

## Reuse & extend
Built on the existing streaming concierge (`api/src/chat.ts`, model **`claude-sonnet-4-6`**,
tools `search_listings` + `capture_lead`). For the mentor we extend it with a
**buyer-advocate system prompt** and add tools:
- `run_calculator` (call the deterministic calcs so numbers are never hallucinated)
- `get_property_data` (comps / overlays / school zones for an address)
- `explain_clause`, `summarise_document` (document vault items)
- `capture_lead` / `book_partner` (route to a human or a partner discount)

> Confirm current model IDs via the **claude-api** skill at build time — don't hard-code from memory.

## Guardrails (trust is the whole product)
- **Never present AI output as legal or financial advice.** Label as general
  information; route contracts/finance decisions to a human/professional.
- **Ground every claim** — cite the comp, the overlay, the source. If it doesn't know,
  it says so and offers the human backstop.
- Deterministic numbers come from `run_calculator`, **not** the model's own arithmetic.
- Privacy: documents stay on-device/in the user's vault; only sent to the API for the
  action the user asked for.

## Free vs paid (see MONETIZATION.md)
- **Free:** everyday mentor Q&A, "questions to ask", basic explanations.
- **Paid AI boosts:** heavy document work — full **contract-clause review**,
  **building-report summarisation**, **negotiation coach**, unlimited mentor during
  **auction week** (1-day / 1-week / 1-month passes).
