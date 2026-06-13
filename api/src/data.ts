import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Resolve the repo-root /data directory relative to this module (api/src/data.ts).
const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "..", "data");

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(dataDir, name), "utf-8")) as T;
}

export interface Listing {
  id: string;
  address: string;
  suburb: string;
  price: string;
  priceNumeric: number;
  beds: number;
  baths: number;
  cars: number;
  landSize: number;
  type: string;
  status: string;
  headline: string;
  blurb: string;
  features: string[];
}

export interface Suburb {
  name: string;
  postcode: string;
  medianHouse: number;
  medianUnit: number;
  trend12mo: string;
  blurb: string;
  lifestyle: string;
  transport: string;
}

export interface Sold {
  address: string;
  suburb: string;
  beds: number;
  baths: number;
  cars: number;
  landSize: number;
  type: string;
  soldPrice: number;
  soldDate: string;
}

export const listings = load<Listing[]>("listings.json");
export const suburbs = load<Suburb[]>("suburbs.json");
export const sold = load<Sold[]>("sold.json");

export const suburbNames = suburbs.map((s) => s.name);

export function suburbByName(name: string): Suburb | undefined {
  return suburbs.find((s) => s.name.toLowerCase() === name.toLowerCase());
}

/**
 * Pick recently-sold comparables to ground a valuation. Prefers same-suburb
 * sales of the same dwelling type, then fills with other same-suburb sales,
 * newest first. Returns up to `limit` comps.
 */
export function comparablesFor(
  suburb: string,
  type: string,
  limit = 8,
): Sold[] {
  const sameSuburb = sold
    .filter((s) => s.suburb.toLowerCase() === suburb.toLowerCase())
    .sort((a, b) => b.soldDate.localeCompare(a.soldDate));

  const sameType = sameSuburb.filter(
    (s) => s.type.toLowerCase() === type.toLowerCase(),
  );
  const otherType = sameSuburb.filter(
    (s) => s.type.toLowerCase() !== type.toLowerCase(),
  );

  return [...sameType, ...otherType].slice(0, limit);
}

/** Filter current for-sale listings by simple buyer criteria (used by the chatbot tool). */
export function searchListings(filters: {
  suburb?: string;
  minBeds?: number;
  maxPrice?: number;
  minPrice?: number;
  type?: string;
}): Listing[] {
  return listings.filter((l) => {
    if (filters.suburb && l.suburb.toLowerCase() !== filters.suburb.toLowerCase())
      return false;
    if (filters.minBeds && l.beds < filters.minBeds) return false;
    if (filters.maxPrice && l.priceNumeric > filters.maxPrice) return false;
    if (filters.minPrice && l.priceNumeric < filters.minPrice) return false;
    if (filters.type && l.type.toLowerCase() !== filters.type.toLowerCase())
      return false;
    return true;
  });
}
