import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

if (!process.env.ANTHROPIC_API_KEY) {
  // Fail loud at boot rather than on the first request — makes a missing key obvious.
  console.warn(
    "[anthropic] ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.",
  );
}

export const anthropic = new Anthropic();

// Models are pinned in CLAUDE.md. Sonnet 4.6 is the quality/price sweet spot for
// both the valuation reasoning and the concierge tool-use loop. Haiku is the
// documented cost lever for high-volume chat — swap CHAT_MODEL to drop cost.
export const REASONING_MODEL = "claude-sonnet-4-6";
export const CHAT_MODEL = "claude-sonnet-4-6";

export const AGENT_NAME = "Manifest Real Estate";
export const AGENT_TAGLINE = "Where dreams meet reality";
