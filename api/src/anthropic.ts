import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// The API process runs from api/, but the key lives in the repo-root .env.
// Load it explicitly so `npm run dev` from either location picks it up.
const here = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(here, "..", "..", ".env") });

if (!process.env.ANTHROPIC_API_KEY) {
  // Fail loud at boot rather than on the first request — makes a missing key obvious.
  console.warn(
    "[anthropic] ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.",
  );
}

export const anthropic = new Anthropic();

// Models. Valuation reasoning stays on Opus 4.8 (the most capable Opus). The
// concierge runs on Sonnet 4.6 — strong enough for its tool use and strict
// grounding rules, at ~40% lower cost than Opus for the high-volume chat path.
export const REASONING_MODEL = "claude-opus-4-8";
export const CHAT_MODEL = "claude-sonnet-4-6";

export const AGENT_NAME = "Manifest Real Estate";
export const AGENT_TAGLINE = "Where dreams meet reality";
// The agents buyers deal with. The concierge names them when arranging a
// callback or inspection so it feels personal rather than faceless.
export const AGENTS = "Rishi and Akshay";
