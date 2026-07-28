/*
 * Self-hosts Vault RE listing photos. On first request we download the image
 * from Vault's CDN and cache it to disk under data/vault-photos/; every
 * request after that is served from our own disk — the browser never talks
 * to Vault directly, which is what their no-hotlinking policy requires.
 *
 * `src` is restricted to Vault's own hosts so this can't become an open
 * image-fetch proxy for arbitrary URLs (SSRF).
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(here, "..", "..", "data", "vault-photos");

function hostAllowed(url: URL): boolean {
  return url.hostname === "vaultre.com.au" || url.hostname.endsWith(".vaultre.com.au");
}

function cacheKey(src: string): string {
  return createHash("sha256").update(src).digest("hex");
}

export interface CachedPhoto {
  buffer: Buffer;
  contentType: string;
}

export async function proxyVaultPhoto(src: string): Promise<CachedPhoto | null> {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !hostAllowed(url)) return null;

  const key = cacheKey(src);
  const dataPath = join(cacheDir, key);
  const metaPath = join(cacheDir, `${key}.ct`);

  if (existsSync(dataPath) && existsSync(metaPath)) {
    try {
      const [buffer, contentType] = await Promise.all([readFile(dataPath), readFile(metaPath, "utf8")]);
      return { buffer, contentType: contentType.trim() };
    } catch {
      // Cache read failed (e.g. corrupt file) — fall through and refetch.
    }
  }

  try {
    const res = await fetch(url, { headers: { Accept: "image/*" } });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());

    await mkdir(cacheDir, { recursive: true });
    await Promise.all([writeFile(dataPath, buffer), writeFile(metaPath, contentType)]);

    return { buffer, contentType };
  } catch (err) {
    console.error("[vault-photo] fetch failed", err);
    return null;
  }
}
