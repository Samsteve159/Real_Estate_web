// Sync the canonical shared package (../core/src) into the app (src/core).
// `app/core` is the source of truth; the app bundles a vendored copy because
// Metro's cross-package linking to a sibling source folder is brittle.
// Run after editing anything in ../core/src:  node scripts/sync-core.mjs
import { readdirSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const from = resolve(here, "../../core/src");
const to = resolve(here, "../src/core");

mkdirSync(to, { recursive: true });
let n = 0;
for (const f of readdirSync(from)) {
  if (f.endsWith(".ts")) {
    copyFileSync(join(from, f), join(to, f));
    n++;
  }
}
console.log(`synced ${n} files: ${from} → ${to}`);
