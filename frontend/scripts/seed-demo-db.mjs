import { readFileSync } from "node:fs"
import { DatabaseSync } from "node:sqlite"
import { fileURLToPath } from "node:url"
import path from "node:path"

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const seed = JSON.parse(
  readFileSync(path.join(frontendRoot, "src", "lib", "demo-seed.json"), "utf8")
)
const db = new DatabaseSync(path.join(frontendRoot, "masjid.db"))

db.exec("PRAGMA wal_checkpoint(TRUNCATE)")
db.exec("PRAGMA journal_mode=DELETE")
db.exec("BEGIN IMMEDIATE")

try {
  db.exec("DELETE FROM donations; DELETE FROM causes;")

  const insertCause = db.prepare(`
    INSERT INTO causes (id, name, target_pence, deadline, allowed_types, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const insertDonation = db.prepare(`
    INSERT INTO donations (
      id, amount_pence, donation_type, cause_id, gift_aid, donor_ref, source, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const cause of seed.causes) {
    insertCause.run(
      cause.id,
      cause.name,
      cause.targetPence,
      cause.deadline,
      JSON.stringify(cause.allowedTypes),
      cause.createdAt
    )
  }

  for (const donation of seed.donations) {
    insertDonation.run(
      donation.id,
      donation.amountPence,
      donation.donationType,
      donation.causeId,
      donation.giftAid ? 1 : 0,
      donation.donorRef,
      donation.source,
      donation.createdAt
    )
  }

  db.exec("COMMIT")
  console.log(`Seeded ${seed.causes.length} causes and ${seed.donations.length} donations.`)
} catch (error) {
  db.exec("ROLLBACK")
  throw error
} finally {
  db.close()
}
