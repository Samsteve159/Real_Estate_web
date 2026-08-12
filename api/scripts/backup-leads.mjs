#!/usr/bin/env node
/*
 * Nightly snapshot of the leads database.
 *
 * Uses SQLite's own online backup API rather than copying the file. That
 * matters here because the database runs in WAL mode: a plain `cp` of
 * leads.db captures a nearly empty file while the real rows sit in
 * leads.db-wal, which is exactly the trap that makes a backup look fine and
 * restore empty.
 *
 * Run from cron:
 *   0 3 * * * cd /srv/manifest/api && /usr/bin/node scripts/backup-leads.mjs >> /srv/manifest/data/backup.log 2>&1
 */
import Database from "better-sqlite3";
import { mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const source = join(root, "data", "leads.db");
const backupDir = join(root, "backups");
const RETAIN_DAYS = 14;

mkdirSync(backupDir, { recursive: true });

const stamp = new Date().toISOString().slice(0, 10);
const dest = join(backupDir, `leads-${stamp}.db`);

const db = new Database(source, { readonly: true });
await db.backup(dest);
db.close();

const { size } = statSync(dest);
console.log(`[backup] ${new Date().toISOString()} wrote ${dest} (${size} bytes)`);

// Prune anything older than the retention window.
const cutoff = Date.now() - RETAIN_DAYS * 24 * 60 * 60 * 1000;
let pruned = 0;
for (const f of readdirSync(backupDir)) {
  if (!f.startsWith("leads-") || !f.endsWith(".db")) continue;
  const p = join(backupDir, f);
  if (statSync(p).mtimeMs < cutoff) {
    unlinkSync(p);
    pruned++;
  }
}
if (pruned) console.log(`[backup] pruned ${pruned} snapshot(s) older than ${RETAIN_DAYS} days`);
