import 'server-only'
import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'masjid.db')

declare global {
  // eslint-disable-next-line no-var
  var __db: DatabaseSync | undefined
}

function initDb(): DatabaseSync {
  const db = new DatabaseSync(DB_PATH)
  db.exec(`PRAGMA journal_mode=WAL`)
  db.exec(`
    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      amount_pence INTEGER NOT NULL,
      donation_type TEXT NOT NULL,
      cause_id TEXT,
      gift_aid INTEGER NOT NULL DEFAULT 0,
      donor_ref TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS causes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_pence INTEGER,
      deadline TEXT,
      allowed_types TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );
  `)
  return db
}

export function getDb(): DatabaseSync {
  if (!global.__db) {
    global.__db = initDb()
  }
  return global.__db
}
