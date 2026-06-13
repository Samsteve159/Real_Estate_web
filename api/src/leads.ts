import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "..", "data");
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, "leads.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at   TEXT NOT NULL,
    source       TEXT NOT NULL,            -- 'valuation' | 'concierge'
    name         TEXT,
    email        TEXT,
    phone        TEXT,
    address      TEXT,
    suburb       TEXT,
    intent       TEXT,                     -- 'sell' | 'buy' | 'inspection' | etc.
    estimate_low  INTEGER,
    estimate_high INTEGER,
    estimate_mid  INTEGER,
    message      TEXT
  );
`);

export interface LeadInput {
  source: "valuation" | "concierge";
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  suburb?: string;
  intent?: string;
  estimateLow?: number;
  estimateHigh?: number;
  estimateMid?: number;
  message?: string;
}

const insert = db.prepare(`
  INSERT INTO leads
    (created_at, source, name, email, phone, address, suburb, intent,
     estimate_low, estimate_high, estimate_mid, message)
  VALUES
    (@created_at, @source, @name, @email, @phone, @address, @suburb, @intent,
     @estimate_low, @estimate_high, @estimate_mid, @message)
`);

export function saveLead(lead: LeadInput): number {
  const row = insert.run({
    created_at: new Date().toISOString(),
    source: lead.source,
    name: lead.name ?? null,
    email: lead.email ?? null,
    phone: lead.phone ?? null,
    address: lead.address ?? null,
    suburb: lead.suburb ?? null,
    intent: lead.intent ?? null,
    estimate_low: lead.estimateLow ?? null,
    estimate_high: lead.estimateHigh ?? null,
    estimate_mid: lead.estimateMid ?? null,
    message: lead.message ?? null,
  });
  return Number(row.lastInsertRowid);
}

export function recentLeads(limit = 50) {
  return db
    .prepare(`SELECT * FROM leads ORDER BY id DESC LIMIT ?`)
    .all(limit);
}
