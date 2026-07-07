# Manifest — Design-Direction Brief (LOCKED)

*Direction set by Akshay. Inspiration references: WHITEFOX Real Estate + LUXE Real Estate — **inspiration only, never copy** (no lifting their colors, CSS, markup, or assets — IP risk). Build original. Last updated 2026-06-24.*

## 0. Locked decisions (do not re-litigate)
- **Black theme.** Dark UI — near-black background, not the demo's light bone/navy.
- **White fonts.** White / off-white type on black.
- **Gold accent.** The logo's gold (`#c2a267`) is the single accent that pops on black. Navy is at most a deep secondary tone.
- **Typeface:** Raleway (retained).
- **Motion hero.** Full-bleed moving imagery in the hero, like the references. Use **tasteful placeholder motion** now (abstract/subtle animated treatment or licensed b-roll), built so Akshay's real footage swaps in trivially. Use **placeholder pictures** elsewhere where the design needs imagery, until real assets/listings arrive.
- **Original build, not the demo.** `legacy/demo_theme` is the reference-only demo copy — do not refine it. Build net-new. (The redundant `Fresh_Build/_reference` duplicate was removed 2026-07-07.)
- **Carries all the tools:** Instant Valuation, AI Buyer Concierge, VIC Stamp-duty, Pre-buying, Portfolio assessment.

## 1. The strategic frame
Premium agencies win on **confidence and polish** (WHITEFOX: dark, monochrome, editorial, video-heavy). Luxury portals win on **trust + heritage tone** (LUXE: "award-winning… built on heritage and trust… your partner for profitable growth," serif/sans pairing, motion).

Manifest's audience is **first-home-buyers, early investors, 1–2-property owners** — so:
> **Take the dark, premium, motion-rich *feel* — but keep the copy warm, plain, and reassuring so a first-home-buyer feels invited, not shut out behind a velvet rope.** The differentiator is broker-grade *tools* presented with calm, confident authority. Black-tie venue, friendly host.

## 2. Palette (black theme — original tokens)
Build fresh dark tokens (these are Manifest's own, not copied):
| Role | Suggested token | Value |
|---|---|---|
| Page background | `--bg` | near-black `#0a0a0b` (not pure #000 — softer) |
| Elevated surface / cards | `--surface` | `#141416` |
| Raised surface | `--surface-2` | `#1c1c20` |
| Primary text | `--text` | `#f5f5f6` (white) |
| Muted text | `--text-muted` | `#a1a1aa` |
| Accent (primary action, eyebrows, underlines) | `--gold` | `#c2a267` |
| Accent hover/bright | `--gold-bright` | `#d4b87a` |
| Deep secondary tone | `--navy` | `#003970` (sparingly) |
| Hairlines | `--line` | `rgba(255,255,255,0.10)` |

**Usage:** mostly black + white with gold used *sparingly* (one CTA per view, eyebrows, key numbers, hover underlines). Gold is the jewel — overuse kills it. Aim ~80% black/white, ~10–15% surfaces, ≤5% gold.

## 3. Typography (Raleway, white)
- White display headlines, large, tight tracking (`-0.01em`), weight 600.
- Body off-white/muted at relaxed line-height (~1.65) for readability on dark.
- Keep the wide-tracked uppercase **gold eyebrow** (0.28em) on every section — the premium tell.
- ≤3 weights. Hierarchy via size + eyebrow, not italics.

## 4. Motion (the "moving pictures")
- **Hero:** full-bleed motion — placeholder now (subtle animated gradient/ken-burns/abstract or licensed b-roll), wired as a swappable `<video>`/background so Akshay's footage drops in with one asset change. Always provide a static poster fallback + respect `prefers-reduced-motion`.
- **Scroll-in:** restrained `rise`/fade on section entry (eased, never bouncy).
- **Listing/imagery:** quiet hover lift; subtle parallax acceptable, sparingly.
- Everything eased and calm — motion signals craft, not noise.

## 5. Layout
- Generous whitespace (dark negative space is luxurious), oversized section padding.
- Full-bleed motion hero → eyebrow + one white headline + one-line subhead + single gold CTA + trust strip.
- **Tools as hero surfaces:** each tool gets its own confident dark panel (surface + gold accents), framed like a premium product, not a form dump.
- Listing cards: image-dominant (placeholder until Vault), minimal text, single hover lift, hairline not heavy borders.

## 6. Build order (non-blocked work first)
1. **Fresh dark design system + Home** — black/white/gold tokens, Raleway, motion hero. *(manifest-ui + frontend-design)*
2. **VIC Stamp-duty calculator** — deterministic, `sro.vic.gov.au`, FHB concession; cross-check Excel ($600k = $31,070). *(calc-verifier)*
3. Remaining tools (Valuation, Concierge, Pre-buying, Portfolio) + pages (Listings w/ mock stock, Listing detail, About/Agents, Contact).
4. Live listings via Vault RE — **blocked** on Akshay's API key; mock until then. *(vault-integrator)*

## 7. North star
**Dark, premium, motion-rich — black & gold, white Raleway, lots of air — broker-grade tools delivered with warm, plain-spoken confidence. Original, never a copy.**
