import 'server-only'
import { randomUUID } from 'node:crypto'
import { getDb } from './db.server'
import type {
  Donation,
  DonationType,
  Cause,
  TypeBalance,
  BalanceSummary,
  CauseProgress,
  ImportResult,
  ImportRecord,
} from './api'

// ── Enums ────────────────────────────────────────────────────────────────────

const VALID_TYPES = new Set<DonationType>([
  'zakat', 'sadaqah', 'lillah', 'zakat_al_fitr', 'fidya', 'kaffarah', 'waqf', 'general',
])

// ── Row → domain mappers ─────────────────────────────────────────────────────

type DbDonation = {
  id: string
  amount_pence: number
  donation_type: string
  cause_id: string | null
  gift_aid: number
  donor_ref: string | null
  source: string
  created_at: string
}

type DbCause = {
  id: string
  name: string
  target_pence: number | null
  deadline: string | null
  allowed_types: string
  created_at: string
}

function mapDonation(row: DbDonation): Donation {
  return {
    id: row.id,
    amountPence: row.amount_pence,
    donationType: row.donation_type as DonationType,
    causeId: row.cause_id,
    giftAid: row.gift_aid === 1,
    donorRef: row.donor_ref,
    source: row.source as 'manual' | 'bulk_import',
    createdAt: row.created_at,
  }
}

function mapCause(row: DbCause): Cause {
  return {
    id: row.id,
    name: row.name,
    targetPence: row.target_pence,
    deadline: row.deadline,
    allowedTypes: JSON.parse(row.allowed_types) as DonationType[],
    createdAt: row.created_at,
  }
}

// ── Donations ────────────────────────────────────────────────────────────────

export function createDonation(data: {
  amountPence: number
  donationType: DonationType
  causeId?: string | null
  giftAid?: boolean
  donorRef?: string | null
  source?: 'manual' | 'bulk_import'
}): Donation {
  const db = getDb()

  if (data.causeId) {
    const cause = db.prepare('SELECT * FROM causes WHERE id = ?').get(data.causeId) as DbCause | undefined
    if (!cause) throw new Error(`Cause ${data.causeId} not found`)
    const allowed: DonationType[] = JSON.parse(cause.allowed_types)
    if (allowed.length > 0 && !allowed.includes(data.donationType)) {
      throw new Error(
        `Donation type '${data.donationType}' is not accepted by cause '${cause.name}'. Allowed: ${allowed.join(', ')}`
      )
    }
  }

  const now = new Date().toISOString()
  const id = randomUUID()
  db.prepare(`
    INSERT INTO donations (id, amount_pence, donation_type, cause_id, gift_aid, donor_ref, source, created_at)
    VALUES (:id, :amount_pence, :donation_type, :cause_id, :gift_aid, :donor_ref, :source, :created_at)
  `).run({
    id,
    amount_pence: data.amountPence,
    donation_type: data.donationType,
    cause_id: data.causeId ?? null,
    gift_aid: data.giftAid ? 1 : 0,
    donor_ref: data.donorRef ?? null,
    source: data.source ?? 'manual',
    created_at: now,
  })

  return mapDonation(
    db.prepare('SELECT * FROM donations WHERE id = ?').get(id) as DbDonation
  )
}

export function listDonations(params?: {
  donationType?: DonationType
  causeId?: string
  uncategorisedOnly?: boolean
}): Donation[] {
  const db = getDb()
  const conditions: string[] = []
  const bindings: Record<string, unknown> = {}

  if (params?.uncategorisedOnly) {
    conditions.push("donation_type = 'uncategorised'")
  } else if (params?.donationType) {
    conditions.push('donation_type = :donation_type')
    bindings.donation_type = params.donationType
  }

  if (params?.causeId) {
    conditions.push('cause_id = :cause_id')
    bindings.cause_id = params.causeId
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = db
    .prepare(`SELECT * FROM donations ${where} ORDER BY created_at DESC`)
    .all(bindings) as DbDonation[]

  return rows.map(mapDonation)
}

export function reclassifyDonation(donationId: string, donationType: DonationType): Donation {
  const db = getDb()
  const row = db.prepare('SELECT * FROM donations WHERE id = ?').get(donationId) as DbDonation | undefined
  if (!row) throw new Error(`Donation ${donationId} not found`)
  if (row.donation_type !== 'uncategorised') {
    throw new Error('Only uncategorised donations can be reclassified')
  }

  if (row.cause_id) {
    const cause = db.prepare('SELECT * FROM causes WHERE id = ?').get(row.cause_id) as DbCause | undefined
    if (cause) {
      const allowed: DonationType[] = JSON.parse(cause.allowed_types)
      if (allowed.length > 0 && !allowed.includes(donationType)) {
        throw new Error(
          `Donation type '${donationType}' is not accepted by cause '${cause.name}'`
        )
      }
    }
  }

  db.prepare('UPDATE donations SET donation_type = ? WHERE id = ?').run(donationType, donationId)
  return mapDonation(
    db.prepare('SELECT * FROM donations WHERE id = ?').get(donationId) as DbDonation
  )
}

// ── Causes ───────────────────────────────────────────────────────────────────

export function listCauses(): Cause[] {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM causes ORDER BY created_at').all() as DbCause[]
  return rows.map(mapCause)
}

export function createCause(data: {
  name: string
  targetPence?: number | null
  deadline?: string | null
  allowedTypes?: DonationType[]
}): Cause {
  const db = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO causes (id, name, target_pence, deadline, allowed_types, created_at)
    VALUES (:id, :name, :target_pence, :deadline, :allowed_types, :created_at)
  `).run({
    id,
    name: data.name,
    target_pence: data.targetPence ?? null,
    deadline: data.deadline ?? null,
    allowed_types: JSON.stringify(data.allowedTypes ?? []),
    created_at: now,
  })
  return mapCause(
    db.prepare('SELECT * FROM causes WHERE id = ?').get(id) as DbCause
  )
}

// ── Balances ─────────────────────────────────────────────────────────────────

export function computeBalances(): BalanceSummary {
  const db = getDb()
  const rows = db.prepare(`
    SELECT donation_type, SUM(amount_pence) as total
    FROM donations
    WHERE donation_type != 'uncategorised'
    GROUP BY donation_type
  `).all() as { donation_type: string; total: number }[]

  const balances: TypeBalance[] = rows.map((r) => ({
    donationType: r.donation_type as DonationType,
    amountPence: r.total,
  }))

  return {
    balances,
    totalPence: balances.reduce((s, b) => s + b.amountPence, 0),
  }
}

export function computeCauseProgress(causeId: string): CauseProgress {
  const db = getDb()
  const cause = db.prepare('SELECT * FROM causes WHERE id = ?').get(causeId) as DbCause | undefined
  if (!cause) throw new Error(`Cause ${causeId} not found`)

  const row = db.prepare(`
    SELECT SUM(amount_pence) as raised
    FROM donations
    WHERE cause_id = ? AND donation_type != 'uncategorised'
  `).get(causeId) as { raised: number | null }

  const raised = row.raised ?? 0
  const targetPence = cause.target_pence ?? null
  const percentage =
    targetPence && targetPence > 0 ? Math.round((raised / targetPence) * 1000) / 10 : null

  return {
    causeId,
    name: cause.name,
    raisedPence: raised,
    targetPence,
    percentage,
  }
}

// ── CSV Import ───────────────────────────────────────────────────────────────

function parseSimpleCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
}

export function importBankStatement(csvContent: string): ImportResult {
  const rows = parseSimpleCsv(csvContent)
  const classified: ImportRecord[] = []
  const uncategorised: ImportRecord[] = []
  const errors: ImportResult['errors'] = []

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2
    const row = rows[i]

    try {
      const rawAmount = (
        row.amount_gbp ?? row.amount ?? row.amount_pence ?? ''
      ).replace(/£|,/g, '').trim()

      if (!rawAmount) {
        errors.push({ row: rowNum, error: 'Missing amount', rowData: row })
        continue
      }

      const amountPence = 'amount_pence' in row
        ? parseInt(rawAmount, 10)
        : Math.round(parseFloat(rawAmount) * 100)

      if (!isFinite(amountPence) || amountPence <= 0) {
        errors.push({ row: rowNum, error: 'Amount must be positive', rowData: row })
        continue
      }

      const rawType = (row.donation_type ?? row.type ?? '').trim().toLowerCase().replace(/ /g, '_')
      const dtype: DonationType = VALID_TYPES.has(rawType as DonationType)
        ? (rawType as DonationType)
        : 'uncategorised'

      const donorRef = row.reference ?? row.description ?? row.ref ?? null

      const donation = createDonation({
        amountPence,
        donationType: dtype,
        donorRef: donorRef || null,
        source: 'bulk_import',
      })

      const record: ImportRecord = {
        row: rowNum,
        donationId: donation.id,
        amountPence,
        donationType: dtype,
        donorRef: donorRef || null,
      }

      if (dtype === 'uncategorised') {
        uncategorised.push(record)
      } else {
        classified.push(record)
      }
    } catch (err) {
      errors.push({
        row: rowNum,
        error: err instanceof Error ? err.message : String(err),
        rowData: row,
      })
    }
  }

  return {
    classified,
    uncategorised,
    errors,
    summary: {
      classifiedCount: classified.length,
      uncategorisedCount: uncategorised.length,
      errorCount: errors.length,
    },
  }
}
