import { anthropic, REASONING_MODEL, AGENT_NAME } from "./anthropic.js";
import { comparablesFor, suburbByName, type Sold } from "./data.js";

export interface ValuationRequest {
  suburb: string;
  street?: string;
  beds: number;
  baths: number;
  cars: number;
  landSize?: number;
  type: string;
}

export interface ValuationResult {
  low: number;
  high: number;
  midpoint: number;
  confidence: "low" | "medium" | "high";
  rationale: string;
  comparables_used: {
    address: string;
    sold_price: number;
    sold_date: string;
    note: string;
  }[];
}

// The exact JSON shape the front-end expects. Described in the prompt and
// parsed tolerantly from the reply — version-agnostic vs. SDK structured outputs.
const SCHEMA_HINT = `{
  "low": integer (AUD),
  "high": integer (AUD),
  "midpoint": integer (AUD),
  "confidence": "low" | "medium" | "high",
  "rationale": string,
  "comparables_used": [ { "address": string, "sold_price": integer, "sold_date": string, "note": string } ]
}`;

const SYSTEM = `You are the valuation engine for ${AGENT_NAME}, an independent real estate agency covering Melbourne's inner and outer west and the northern growth corridors.

Produce an INDICATIVE price range for a subject property using the recently-sold comparable sales and suburb context provided. This is a marketing estimate, not a formal valuation — be realistic and grounded in the comps, never wildly optimistic.

Rules:
- Anchor the range to the supplied comparable sales. Adjust up or down for bedrooms, bathrooms, car spaces, land size and dwelling type versus the comps.
- Keep the low-to-high spread sensible: roughly 8-14% of the midpoint for typical homes. Wider only when comps are sparse or inconsistent.
- Set confidence to "high" when several close same-type comps exist, "medium" when comps are mixed, "low" when comps are sparse.
- In "rationale", write 2-3 plain-English sentences a homeowner would understand, referencing the comps and the suburb trend.
- In "comparables_used", list the 2-4 sales that most influenced the estimate with a one-line note each on how they compare.
- All dollar figures are whole AUD integers.

Respond with ONLY a single JSON object in exactly this shape, no prose, no code fences:
${SCHEMA_HINT}`;

function describeComps(comps: Sold[]): string {
  if (comps.length === 0) return "No recent comparable sales available for this suburb.";
  return comps
    .map(
      (c) =>
        `- ${c.address} — ${c.type}, ${c.beds} bed / ${c.baths} bath / ${c.cars} car, ${
          c.landSize ? c.landSize + "sqm land" : "no land (attached)"
        }, sold $${c.soldPrice.toLocaleString()} on ${c.soldDate}`,
    )
    .join("\n");
}

export async function valuate(req: ValuationRequest): Promise<ValuationResult> {
  const comps = comparablesFor(req.suburb, req.type);
  const suburb = suburbByName(req.suburb);

  const suburbContext = suburb
    ? `Suburb: ${suburb.name} ${suburb.postcode}. Median house $${suburb.medianHouse.toLocaleString()}, median unit $${suburb.medianUnit.toLocaleString()}, 12-month trend ${suburb.trend12mo}. ${suburb.blurb}`
    : `Suburb: ${req.suburb} (no median data on file).`;

  const userPrompt = `Subject property:
- Suburb: ${req.suburb}
- Street: ${req.street ?? "(not provided)"}
- Type: ${req.type}
- Bedrooms: ${req.beds}
- Bathrooms: ${req.baths}
- Car spaces: ${req.cars}
- Land size: ${req.landSize ? req.landSize + " sqm" : "(not provided)"}

${suburbContext}

Recently sold comparables:
${describeComps(comps)}

Return the indicative valuation as JSON matching the required schema.`;

  const response = await anthropic.messages.create({
    model: REASONING_MODEL,
    max_tokens: 1500,
    system: SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("Valuation model returned no text content");
  }
  return extractJson(text.text);
}

/** Pull the JSON object out of the model reply, tolerating stray prose or code fences. */
function extractJson(raw: string): ValuationResult {
  const fenced = raw.replace(/```(?:json)?/gi, "").trim();
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in valuation reply");
  }
  return JSON.parse(fenced.slice(start, end + 1)) as ValuationResult;
}
