/**
 * One-off scraper for Manifest RE's PUBLIC listings.
 *
 * Pure fetch + regex — NO LLM is involved, so running it costs $0 in API spend.
 * It is polite: one index fetch + one fetch per listing with a 350ms delay and
 * an identifying User-Agent. Re-run occasionally to refresh `data/listings.json`.
 *
 *   node scripts/scrape-listings.mjs
 */
import { writeFileSync, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data", "listings.json");
const SEED = join(ROOT, "data", "listings.seed.json");

const BASE = "https://www.manifestre.com.au";
const UA = { "User-Agent": "Mozilla/5.0 (compatible; ManifestCompanionBot/1.0; one-off listing sync)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function decode(s = "") {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&#0?34;|&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function get(url) {
  const res = await fetch(url, { headers: UA, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function parseListing(html, id, slug) {
  const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "");
  const address =
    decode(html.match(/property="og:title"\s+content="([^"]*)"/i)?.[1] ?? "") ||
    title.replace(/\s*\|\s*Manifest Real Estate.*$/i, "").trim();
  if (!address) return null;

  // Suburb is the part after the last comma; for comma-less estate/land
  // listings the whole title is already the place name (e.g. "Winter Valley").
  const suburb = address.includes(",") ? address.split(",").pop().trim() : address.trim();

  const priceStr = decode(html.match(/class="[^"]*price[^"]*"[^>]*>\s*(\$[^<]+)</i)?.[1] ?? "") || "Contact agent";
  const nums = [...priceStr.matchAll(/\$([\d,]+)/g)].map((m) => Number(m[1].replace(/,/g, "")));
  const priceNumeric = nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;

  // Spec chips: `<digit><span class="tooltip">Label</span>`
  const specs = {};
  for (const m of html.matchAll(/(\d+)\s*<span class="tooltip">([^<]+)<\/span>/gi)) {
    specs[m[2].toLowerCase().trim()] = Number(m[1]);
  }
  const beds = specs["bedrooms"] ?? 0;
  const baths = specs["bathrooms"] ?? 0;
  const cars = specs["garages"] ?? specs["car spaces"] ?? specs["carports"] ?? specs["parking"] ?? 0;
  const landKey = Object.keys(specs).find((k) => k.includes("land") || k.includes("area"));
  const landSize = landKey ? specs[landKey] : 0;

  const blurb = decode(
    html.match(/property="og:description"\s+content="([^"]*)"/i)?.[1] ??
      html.match(/name="description"\s+content="([^"]*)"/i)?.[1] ??
      "",
  );

  // Feature bullets from the description body: "- text<br />"
  const features = [...html.matchAll(/[-•]\s*([^<•]{4,80}?)\s*<br\s*\/?>/gi)]
    .map((m) => decode(m[1]))
    .filter((f) => f && !/^https?:/.test(f))
    .slice(0, 6);

  const type =
    beds === 0 ? "Land" : /^\d+[a-z]?-\d+-/.test(slug) ? "Unit" : "House";

  // Prefer a genuine marketing tagline (the segment before " - " that isn't the
  // "Manifest Real Estate presents…" boilerplate); otherwise synthesise a clean one.
  const firstSeg = (blurb.split(/\s[-–]\s/)[0] ?? "").trim();
  const headline =
    firstSeg && !/manifest real estate/i.test(firstSeg) && firstSeg.length <= 72
      ? firstSeg
      : beds > 0
        ? `${beds}-bed ${type.toLowerCase()} in ${suburb}`
        : `${type} opportunity in ${suburb}`;

  return {
    id: `mre-${id}`,
    address,
    suburb,
    price: priceStr,
    priceNumeric,
    beds,
    baths,
    cars,
    landSize,
    type,
    status: "for-sale",
    headline,
    blurb: blurb.slice(0, 320),
    features,
    source: `${BASE}/property?property_id=${id}/${slug}`,
  };
}

async function main() {
  console.log("Fetching /buy index…");
  const buy = await get(`${BASE}/buy`);

  const map = new Map();
  for (const m of buy.matchAll(/\/property\?property_id=(\d+)(?:\/([a-z0-9-]+))?/gi)) {
    const [, id, slug] = m;
    if (!map.has(id) && slug) map.set(id, slug);
  }
  console.log(`Found ${map.size} listings.`);

  const listings = [];
  for (const [id, slug] of map) {
    try {
      const html = await get(`${BASE}/property?property_id=${id}/${slug}`);
      const parsed = parseListing(html, id, slug);
      if (parsed) {
        listings.push(parsed);
        console.log(`  ✓ ${parsed.address} — ${parsed.price} (${parsed.beds}/${parsed.baths}/${parsed.cars})`);
      } else {
        console.log(`  · skipped ${id} (no address)`);
      }
    } catch (e) {
      console.log(`  ✗ ${id}: ${e.message}`);
    }
    await sleep(350); // be polite
  }

  if (listings.length < 3) {
    console.error(`Only ${listings.length} parsed — leaving existing data untouched.`);
    process.exit(1);
  }

  if (!existsSync(SEED) && existsSync(OUT)) {
    copyFileSync(OUT, SEED); // preserve the original representative seed once
    console.log("Backed up representative seed → data/listings.seed.json");
  }

  writeFileSync(OUT, JSON.stringify(listings, null, 2) + "\n");
  console.log(`\nWrote ${listings.length} real listings → data/listings.json`);
}

main().catch((e) => {
  console.error("Scrape failed:", e.message);
  process.exit(1);
});
