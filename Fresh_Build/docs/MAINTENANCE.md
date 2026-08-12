# MAINTENANCE — rates, tax & policy assumptions

The client tools are **deterministic**: every number comes from a formula, not from AI.
A few official figures (tax brackets, stamp-duty schedule, lending buffers) are baked
in as **named constants**. When government or lender policy changes, those constants
need a one-time update. This doc is the map so any developer can do it in minutes and
verify it.

> **Interest rate is NOT in here on purpose.** In the Rental and Pre-buying tools the
> interest rate is a field the customer enters, so a rate rise/fall needs **no update** —
> whatever they type flows straight through the maths.

---

## Ownership — TO CONFIRM WITH AKSHAY

Who performs these updates after handover is **not yet decided**. Until it is, the
codebase maintainer (currently the dev who built it) makes the edit on request.

Recommended model: **codebase-maintainer owned**, on a known cadence (below), because
each change is a single labelled constant plus a verification check — a ~15-minute task,
not a dev project. Akshay to confirm who holds it long-term.

---

## What can change, and where

Each assumption lives in exactly one place. Updating it once propagates everywhere it's
used (e.g. the stamp-duty engine is reused by Pre-buying's "upfront costs").

> **Paths are `Fresh_Build/site-v2/src/lib/…`** — V2 is the locked, deployed build.
> Until 2026-08-04 this table said `site/src/lib/…`, which is **V1: archived reference
> only**. Editing a constant there changes nothing on the live site.

| Assumption | File | Constant / function | Trigger to update | Official source |
|---|---|---|---|---|
| **Income tax brackets** (drives borrowing capacity) | `site-v2/src/lib/preBuying.ts` | `TAX_BRACKETS`, `MEDICARE_LEVY` | New financial year / any tax-cut change | ATO resident income tax rates |
| **APRA serviceability buffer** | `site-v2/src/lib/preBuying.ts` | `APRA_BUFFER` (currently `0.03` = +3%) | APRA changes the buffer | APRA lending standards (APG 223) |
| **LMI estimate bands** | `site-v2/src/lib/preBuying.ts` | `lmiRate()` | Insurer/lender market shift (indicative only) | Helia / QBE LMI tables |
| **Other upfront fees** (legal, inspection, etc.) | `site-v2/src/lib/preBuying.ts` | `FIXED_COSTS` | When typical fees move | Conveyancer / market |
| **VIC stamp-duty schedule** (bands & rates) | `site-v2/src/lib/stampDuty.ts` | `GENERAL_BRACKETS`, `PPR_BRACKETS` | Victorian state budget / SRO indexation | sro.vic.gov.au — land transfer duty |
| **First-home-buyer thresholds** | `site-v2/src/lib/stampDuty.ts` | `FHB_EXEMPT_CEILING` ($600k), `FHB_CONCESSION_CEILING` ($750k) | FHB policy change | SRO |
| **Foreign-purchaser surcharge** | `site-v2/src/lib/stampDuty.ts` | `FOREIGN_DUTY_RATE` (currently `0.08` = 8%) | State budget change | SRO |
| **Usable-equity lending rule** | `site-v2/src/lib/portfolio.ts` | `LEND_RATIO` (currently `0.80` = 80%) | Lending-norm change | — |

### Eligibility rules baked into the duty engine

Not everything is a number. `calculateDuty()` also encodes **who qualifies**, and that
is just as liable to change:

- **A foreign purchaser gets no first-home-buyer benefit.** The SRO requires *all*
  purchasers to be "Australian citizens or permanent residents", so `fhbEligible` is
  false whenever `foreignPurchaser` is set, and duty falls back to the general rate.
  (Fixed 2026-08-04 — the tool previously applied the FHB taper *and* the 8% surcharge,
  understating $650k FHB + foreign as $63,357 against the SRO's $86,070.)
- **The 8% surcharge is charged on the full dutiable value**, "excluding any
  concessions" per the SRO, so it is never reduced by a PPR or FHB benefit.
- **The PPR concession is not citizenship-gated** and is deliberately still available
  alongside the surcharge.

---

## Cadence (when to check)

Low and predictable — this is light maintenance, not an ongoing commitment:

- **~July each year** — new ATO tax brackets / Medicare settings → review `TAX_BRACKETS`.
- **After each Victorian State Budget** (usually May) — duty bands, FHB thresholds,
  foreign surcharge → review `stampDuty.ts`.
- **Ad hoc** — only if APRA moves the buffer or LMI/market norms shift materially.

---

## Update procedure

1. **Edit the constant** in the one file above with the new official figure.
2. **Verify** against the source's published examples / anchor points. Known anchors for
   the stamp-duty engine (keep these passing):
   - General $600,000 → **$31,070**
   - PPR $500,000 → **$21,970**
   - FHB $650,000 → **$11,356.67**
   - FHB $650,000 **foreign purchaser** → **$86,070 total payable** (no FHB benefit:
     $34,070 general + $52,000 surcharge). Cross-check any of these against the
     [SRO calculator](https://www.e-business.sro.vic.gov.au/calculators/land-transfer-duty).
3. **Typecheck + build**: `cd Fresh_Build/site-v2 && npx tsc --noEmit && npm run build`.
4. **Redeploy** the site: `rsync -az --delete -e "ssh -i ~/.ssh/manifest_vps" dist/ manifest@97.74.94.97:/srv/manifest/site-dist/`.
   Static-only, so **no service restart and no downtime** — the API keeps running.
5. **Confirm on the live site**, with DNS pinned to the server rather than
   trusting your resolver (a stale cache pointing at the retired Cloudflare IPs
   returns a 404 page that looks exactly like a broken deploy):
   `curl --resolve manifestre.com.au:443:97.74.94.97 https://manifestre.com.au/tools/stamp-duty`

> **This is a live site now** (since 2026-08-12). Duty figures shown here are
> used by real buyers, so verify against the SRO calculator before deploying,
> not after.
5. Update the dated comment label in the file (e.g. the `2024–25` note in `preBuying.ts`)
   so it's obvious which year's figures are loaded.

---

## Out of scope of this doc

- **Interest rate** — a customer input, never hardcoded (see note at top).
- **Concierge / valuation model choice & cost** — see `CLAUDE.md` and
  `api/src/anthropic.ts` (`CHAT_MODEL` / `REASONING_MODEL`).
