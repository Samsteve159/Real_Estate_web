import type { Context, Next } from "hono";

/**
 * Tiny in-memory sliding-window rate limiter, keyed per client IP + bucket.
 * Protects the Claude-backed endpoints from abuse and cost runaway. For a
 * single-instance demo this is plenty; on Cloudflare swap for a Durable Object
 * or KV-backed limiter.
 */
const hits = new Map<string, number[]>();

function clientKey(c: Context, bucket: string): string {
  const ip =
    c.req.header("cf-connecting-ip") ??
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";
  return `${bucket}:${ip}`;
}

export function rateLimit(bucket: string, limit: number, windowMs: number) {
  return async (c: Context, next: Next) => {
    const key = clientKey(c, bucket);
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= limit) {
      const retryMs = windowMs - (now - recent[0]);
      c.header("Retry-After", String(Math.ceil(retryMs / 1000)));
      return c.json(
        { error: "Too many requests — please slow down and try again shortly." },
        429,
      );
    }

    recent.push(now);
    hits.set(key, recent);
    await next();
  };
}

// Periodically drop stale buckets so the map can't grow unbounded.
setInterval(() => {
  const cutoff = Date.now() - 10 * 60_000;
  for (const [key, times] of hits) {
    if (times.every((t) => t < cutoff)) hits.delete(key);
  }
}, 5 * 60_000).unref();
