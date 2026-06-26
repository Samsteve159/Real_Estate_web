# Manifest Overhaul — Project Tracker

Living status doc. Updated as we go. Plan: `~/.claude/plans/we-need-to-to-sequential-deer.md`.
Last updated: **2026-06-26**.

## Status legend
✅ done · 🟡 in progress · ⛔ blocked (waiting on owner/third party) · ⬜ not started

## Phase 0 — Setup
| Item | Status | Notes |
|---|---|---|
| `Fresh_Build/` skeleton (`website`, `app`, `Assets`) | ✅ | created |
| Asset drop-guides (`Assets/README.md`, `Fresh_Build/README.md`) | ✅ | |
| WhatsApp to Akshay (domain Q + Vault RE email folded in) | ✅ | `akshay-whatsapp.md`; **sent by owner** |
| Logo received | ✅ | `Assets/logo/…Color.png` — navy + gold; matches `demo_theme` palette |
| Newsletter bot blueprint received | ✅ | `Assets/newsletter/` = Girish LinkedIn-bot pattern (reuse for Milestone 3) |
| Excel file (formula audit) | ✅ | `2026_CHECK PROPERTY STATS.xlsx` audited — math correct (VIC duty + loan interest verified to the $). Issues: orphaned `#REF!` named ranges (unused, harmless now); FHB stamp-duty concession not wired up. Duty tables reusable for the stamp-duty tool |
| Domain name confirmed | ⛔ | asked Akshay via WhatsApp |
| Vault RE API access (key + token) | ⛔ | Akshay to email api@vaultre.com.au |
| Anthropic (Claude) account under Manifest | ⏸️ postponed | instructions ready (`akshay-anthropic-setup.md`); revisit later. Local dev uses existing key meanwhile |
| Build the 4 project agents | ✅ | `.claude/agents/`: vault-integrator, manifest-ui, calc-verifier, content-engine |
| Clean broken Excel names | ✅ | 19 `#REF!` names removed → `…STATS (cleaned).xlsx`; values/formatting untouched |
| Design-direction brief (whitefox + luxhabitat crawl) | ✅ | `Assets/design-direction-brief.md`. Crawled WHITEFOX (positioning) + luxury-RE patterns. North star: **premium-agency calm + broker-grade tools + first-home-buyer warmth** — keep navy/gold/Raleway, elevate via whitespace, photography-first cards, tools-as-hero panels |

## Decisions locked
- **Build fresh — never refine the demo.** `demo_theme` / `Fresh_Build/website` (a demo copy) are reference only. Deliverable is a net-new site + the tools.
- **Design (Akshay):** black theme, white fonts, gold accent (`#c2a267`), Raleway. Motion hero ("moving pictures") via tasteful **placeholder motion** (swappable for real footage); placeholder pictures as needed. **Inspiration only, never copy** WHITEFOX / LUXE (IP risk) — build original. Full brief: `Assets/design-direction-brief.md`.
- Foundation: **custom React** (Vite + React + TS + Tailwind), local-first / host-agnostic.
- Hosting target (Cloudflare vs VM) **deferred** to go-live — and must be **Manifest/Akshay's**, not Sameer's.
- **All infra/accounts under Manifest/Akshay's credentials** (domain, VM, ESP, Anthropic billing, Vault). Never Sameer's.
- Repo: `Fresh_Build/` is net-new; old `demo_theme/web/api/docs` kept as reference.
- Hard cap ≤ **$500/mo**.

## Milestone 1 — Live website + Vault RE listings
| Item | Status |
|---|---|
| `vault.ts` API client (auth, fetch, normalize, cache) | ⬜ (blocked on API access) |
| Scaffold `Fresh_Build/website/` from `demo_theme` baseline | ✅ runs on :5175 (proxies API :8787); logo wired; renders OK |
| Design system (tokens/type from brief + logo) | ✅ | black/white/gold dark token set live in `site/src/index.css`; logo recolored for black + wired into nav |
| Pages: Home, Listings, Listing detail, About/Agents, Contact | 🟡 | Home, Listings (mock), About (real Akshay photo ✅), Contact ✅. Listing-detail page ⬜ (waits on Vault RE shape) |
| AI Buyer Concierge over real listings | ✅ (mock) | `routes/ConciergePage.tsx` + `streamChat` in `site/lib/api.ts` → existing `/api/chat` SSE (tool-use: search_listings + capture_lead). Full-page dark chat, suggestions, lead capture. Runs over mock listings now; swaps to Vault with no UI change. **Model: `claude-sonnet-4-6`** (downgraded from Opus 4.8 to cut cost ~40%; valuation still Opus 4.8). Live test needs `ANTHROPIC_API_KEY` in `api/.env` |
| Lead capture → DB | ✅ | valuation + contact forms POST `/api/lead` → SQLite; contact tagged `source:"contact"` |

## Milestone 2 — Client tools
| Tool | Status | Notes |
|---|---|---|
| Instant Valuation | ✅ | `routes/ValuationPage.tsx` + `lib/api.ts` → existing `/api/valuation` (now mismatch-fixed). Suburb dropdown, comps, lead capture. Dark restyle |
| Portfolio assessment | ✅ | `lib/portfolio.ts` + `routes/PortfolioPage.tsx`. Multi-property value/debt/equity/LVR, **usable equity** (80% rule), gross yield. Deterministic, no API |
| Rental yield & cash flow | ✅ | `lib/rental.ts` + `routes/RentalPage.tsx`. Gross/net yield, operating expenses, interest-only cash flow, positive/negative gearing verdict. Deterministic, no API. 6th tool added to mega-menu/footer/mobile/showcase |
| Pre-buying tool | ✅ | engine `site/src/lib/preBuying.ts` + UI `routes/PreBuyingPage.tsx`. Borrowing capacity (ATO 2024-25 tax → net income → surplus serviced at rate+3% APRA buffer), deposit/LVR, **indicative LMI** by LVR band, full upfront costs (reuses verified stamp-duty engine). Verdict banner + max-purchase. Indicative-only labelling throughout. Typechecks + builds clean |
| VIC Stamp-duty calculator | ✅ | deterministic engine `site/src/lib/stampDuty.ts` + UI `routes/StampDutyPage.tsx`. Rates pulled live from sro.vic.gov.au (general/non-PPR, PPR, FHB). **FHB exemption + concession built** (≤$600k=$0; $600,001–$750k phase-in). Foreign-purchaser 8% toggle. Verified vs SRO anchors: $600k=$31,070 ✓, PPR $500k=$21,970, FHB $650k=$11,356.67. Typechecks clean |

## Milestone 3 — Trust engine
| Item | Status |
|---|---|
| Newsletter engine (adapt Girish bot pattern) | ⬜ |
| Monthly per-client market-update emails | ⬜ |

## TODO next session
- **Vault RE listings** (blocked on Akshay's API access): build `vault.ts` client, normalise to the listing shape, replace `mockListings`, build the **listing-detail page**.
- **Live verify the AI tools**: add Akshay's `ANTHROPIC_API_KEY` to `api/.env`, run `api` (:8787) + `site` (:5180), confirm Valuation returns a range + the fixed comps, and the concierge chats and captures a lead.
- **Real assets to swap**: Akshay's hero footage (`site/public/hero/hero.mp4`) and/or a real B&W skyline photo (`site/public/hero/melbourne-skyline.jpg`); white/mono logo SVG if available; About page bio copy. (Contact details ✓; About page photo ✓ — real headshot now wired.)
- **Milestone 3 (separate from the website)**: newsletter + monthly market-update engine via the content-engine agent.
- Optional polish: visual QA pass in-browser of the 6 tools + nav mega-menu + floating bot.

## Open questions for owner
- Which **domain** (awaiting Akshay).
- Production account ownership specifics (Anthropic billing, hosting, ESP) — confirm all under Manifest/Akshay.
- Excel: what is it meant to calculate? (audit once received).
- **Who owns calculator maintenance** (tax brackets, stamp-duty schedule, APRA buffer) after handover — see `Fresh_Build/MAINTENANCE.md`. Recommend codebase-maintainer-owned on an annual/post-budget cadence; Akshay to confirm.

## Changelog
- **2026-06-27 (About bio grounded in Akshay's real profile)** — Owner shared Akshay's actual bio from manifestre.com.au. Rewrote the AboutPage founder copy to match it: dropped the fabricated first-home-buyer origin story; led with the "Manifest = turning manifestations into reality" brand thread, his three pillars (clear communication, service, trust), breadth across the lot (land/houses/development/acreage), his own portfolio as a credibility hook, and the responsive/proactive/referral personality. Added his client pull-quote ("a knack to evolve and become more efficient with the ever-changing market") as a gold-left-border blockquote, **no attribution label** (owner felt "In a client's words" / "A Manifest client" didn't sit right). Top intro left first-home-buyer-framed per owner. Typecheck clean; verified via headless screenshot.
- **2026-06-26 (reviews + agent photo)** — Owner asked to put real client reviews + Akshay's photo on the site. realestate.com.au (the agency review page) is behind Akamai bot protection → `HTTP 429` on every automated fetch; pulled Akshay's headshot instead from `manifestre.com.au/agents` (same photo), resized 800×800 → `site/public/akshay-kapoor.jpg`. (1) **Home `TrustBand`**: replaced the 2 placeholder testimonials with **4 real reviews** owner supplied from realestate.com.au (condensed faithfully for the card layout; the 2 truncated ones completed using only owner's wording — no invented claims). Added a section header with Akshay's avatar + 5-star line; each card shows a gold ★★★★★ row. Attribution kept as **"Verified seller · realestate.com.au"** — confirmed with owner the source page shows no reviewer names, only "Verified seller". (2) **AboutPage** founder block: swapped the "Photo of Akshay" placeholder for the real headshot (4:5, gold top-accent). Typecheck clean; verified both via headless full-page screenshots (CDP, reduced-motion + scroll to trip lazy-load). Committed + pushed (`0a81079`).
- **2026-06-26 (UX + cost pass)** — Owner-requested fixes: (1) **Tools mega-menu hover bug** fixed (`components/ToolsMenu.tsx`) — the `position: fixed` panel was detached from the trigger, so crossing the dead gap fired `mouseleave` and closed it; added a close-delay timeout, panel hover handlers, and a transparent bridge over the gap. (2) **Contact details made real** (`routes/ContactPage.tsx`): admin@manifestre.com.au, +61 403 466 216, 2 Blackwood Drive, Altona North VIC 3025 (email/phone now tappable). (3) **Landing order swapped** (`routes/Home.tsx`) — Current Listings now leads, broker-grade Tools follow (lead with the product, then the differentiator). (4) **Concierge model downgraded Opus 4.8 → `claude-sonnet-4-6`** (`api/src/anthropic.ts`) to cut cost ~40%; Sonnet holds the tool-use + grounding discipline the bot needs. Valuation reasoning stays on Opus 4.8. Typecheck clean. **Needs API restart to take effect.**
- **2026-06-25 (hero refine)** — Owner feedback on the hero: redrew the **skyline with more contrast + character** (varied tops, antennas, Eureka/spire landmarks; no longer a bar graph) and raised opacity to 0.8 so it's clearly visible. **Removed the tool-chip trust strip** under the CTAs and the **scroll indicator + its animation**. Rewrote the subhead to: "Buying or selling property should feel exciting, not overwhelming. With the right agent beside you and broker-grade tools at your fingertips, every step is a confident one." Build clean.
- **2026-06-25 (rental + hero)** — Built the **Rental tool** (`lib/rental.ts` + `routes/RentalPage.tsx`): gross/net yield, operating costs, interest-only cash flow, positive/negative gearing verdict. Wired into route `/tools/rental`, the Tools mega-menu (now **6 buckets**, 3-col grid), mobile menu, footer and home ToolsShowcase (removed the "More coming" filler). Added a **black-and-white Melbourne skyline** to the hero (`public/hero/melbourne-skyline.svg`, greyscale, with a swap point for a real photo at `melbourne-skyline.jpg`). Removed the low-value **"Broker-grade tools, free"** eyebrow from the hero trust strip. Typecheck + build clean.
- **2026-06-25 (nav + UX pass)** — Owner-requested changes: (1) **Tools mega-menu** (`components/ToolsMenu.tsx`) folds the 5 tools into 5 big animated buckets under the "Tools" label (staggered reveal + hover lift; Concierge bucket opens the floating bot). (2) **Floating concierge** (`components/ConciergeWidget.tsx`) mounted globally in Shell, fixed bottom-right, follows scroll; opens via launcher or `manifest:open-concierge` event. (3) Nav: 4 labels pushed right (`ml-auto`), **"Value my home" CTA removed**, mobile hamburger reworked with an expandable Tools group. (4) **Copy made first-home-buyer-centric with strong hooks** (hero "Buy your first home with your eyes open"; hero CTA "See what you can afford"; seller band "Sell with us"). (5) **All em dashes removed** site-wide (22 files swept + artifacts fixed). Typecheck + build clean.
- **2026-06-25 (concierge)** — Built the **AI Buyer Concierge** page on the new site: full-page dark chat (`routes/ConciergePage.tsx`) over the existing `/api/chat` SSE endpoint, with `streamChat` added to `site/lib/api.ts`. Reuses the backend's tool-use loop (search_listings, capture_lead) so it stays grounded in the listing book and records leads. Suggestions, typing dots, tool-status notes, graceful "API not running" fallback. Typechecks + builds clean. Runs over mock listings; will swap to Vault RE with no UI change. Live chat needs `ANTHROPIC_API_KEY` in `api/.env`. **All 5 client tools + concierge now built.**
- **2026-06-25 (tools complete)** — Built **Instant Valuation** (new site, wired to fixed `/api/valuation` via new `site/lib/api.ts`; suburb dropdown + comps + lead capture), **Portfolio assessment** (`lib/portfolio.ts` — value/debt/equity/LVR/usable-equity/yield), and **About + Contact** pages (Contact form → `/api/lead` with `source:"contact"`; extended the lead endpoint + `LeadInput` to accept contact source/intent). Verified the valuation reconcile fix corrects a swapped model output against real `sold.json`. **Milestone-2 calculators all done** (valuation, stamp-duty, pre-buying, portfolio). api + site typecheck + build clean. Remaining: Concierge page + Vault RE listings (blocked on API access) + listing-detail page.
- **2026-06-25 (later)** — Built **Pre-buying tool** (Milestone 2). Fixed the **valuation price/property mismatch** (owner feedback): the LLM was transposing comp prices onto wrong addresses → added `reconcileComps()` in `api/src/valuation.ts` that re-binds every cited comp's price/date to the ground-truth `sold` record by address (seed data confirmed clean). **Logo recolored for the black theme** (owner feedback: navy won't contrast): navy elements → white, gold kept → `site/public/manifest-logo-white.png` (+ `manifest-logo-mono.png`, cropped `manifest-mark.png`, `favicon.png`); wired the tower mark + wordmark into the nav. **Newsletter bot confirmed NOT part of the website** (it's the Milestone-3 trust engine, separate). Site typechecks + builds clean.
- **2026-06-25** — Built the **VIC Stamp-duty calculator** (Milestone 2). Deterministic engine (`site/src/lib/stampDuty.ts`) with the general/PPR/FHB schedules pulled live from sro.vic.gov.au; verified every band against SRO anchors ($600k general = $31,070, matches the audited Excel to the dollar). FHB **exemption + concession phase-in** built (the part the Excel left unfinished). Premium dark UI page with live result, breakdown, saving callout, rate-schedule reference + lead CTA. Typechecks clean. Next: wire remaining tool pages (Valuation, Pre-buying, Portfolio, Concierge) — currently stubs.

- **2026-06-24 (direction locked)** — Akshay's design direction set & written into all docs (CLAUDE.md, brief, this tracker, memory): **black theme, white fonts, gold accent, Raleway, motion hero (placeholder), inspiration-only/original, all tools**. Confirmed the `Fresh_Build/website` baseline is a demo copy → building the real site **net-new**. Properly accessed WHITEFOX + LUXE for direction (WHITEFOX = dark midnight-navy monochrome editorial; LUXE = serif/sans, heritage/trust/advisory tone) — for inspiration only, copies deleted. Next: build fresh dark design system + motion-hero Home (manifest-ui/frontend-design), then VIC stamp-duty (calc-verifier).
- **2026-06-24 (restart)** — Session restarted to load fixed fetcher. Crawled WHITEFOX + luxury-RE references → wrote `Assets/design-direction-brief.md`. North star: premium-agency calm + broker-grade tools + first-home-buyer warmth (keep navy/gold/Raleway, elevate via whitespace + photography-first cards + tools-as-hero panels). Next: apply elevation pass to `website/` Landing.
- **2026-06-24 (later)** — Cleaned Excel (#REF! names). Built 4 agents. Upgraded context-mode → v1.0.166 (restart pending). Scaffolded `Fresh_Build/website/` from demo_theme baseline — runs on :5175, renders, logo wired. Next: restart → design crawl → elevate look.
- **2026-06-24** — Pivoted from 2-tool demo to full overhaul. Created `Fresh_Build/`, asset guides, Akshay WhatsApp (domain + Vault). Logo + newsletter-bot blueprint received. Locked: custom React, Manifest-owned infra, $500/mo cap. Wrote Akshay's Anthropic-account setup steps ($200/mo cap). Owner approved building all 4 agents.
