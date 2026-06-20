const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

// ── Domain types ────────────────────────────────────────────────────────────

export type DonationType =
  | "zakat"
  | "sadaqah"
  | "lillah"
  | "zakat_al_fitr"
  | "fidya"
  | "kaffarah"
  | "waqf"
  | "general"
  | "uncategorised"

export type SourceType = "manual" | "bulk_import"

export interface Donation {
  id: string
  amountPence: number
  donationType: DonationType
  causeId: string | null
  giftAid: boolean
  donorRef: string | null
  source: SourceType
  createdAt: string
}

export interface DonationCreate {
  amountPence: number
  donationType: DonationType
  causeId?: string | null
  giftAid?: boolean
  donorRef?: string | null
  source?: SourceType
}

export interface Cause {
  id: string
  name: string
  targetPence: number | null
  deadline: string | null
  allowedTypes: DonationType[]
  createdAt: string
}

export interface TypeBalance {
  donationType: DonationType
  amountPence: number
}

export interface BalanceSummary {
  balances: TypeBalance[]
  totalPence: number
}

export interface CauseProgress {
  causeId: string
  name: string
  raisedPence: number
  targetPence: number | null
  percentage: number | null
}

export interface ImportRecord {
  row: number
  donationId: string
  amountPence: number
  donationType: DonationType
  donorRef: string | null
}

export interface ImportError {
  row: number
  error: string
  rowData: Record<string, string>
}

export interface ImportResult {
  classified: ImportRecord[]
  uncategorised: ImportRecord[]
  errors: ImportError[]
  summary: {
    classifiedCount: number
    uncategorisedCount: number
    errorCount: number
  }
}

// ── Key-case converters ─────────────────────────────────────────────────────

function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())
}

function mapKeys<T>(obj: unknown, fn: (k: string) => string): T {
  if (Array.isArray(obj)) return obj.map((v) => mapKeys(v, fn)) as T
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [fn(k), mapKeys(v, fn)])
    ) as T
  }
  return obj as T
}

// ── Fetch helpers ───────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store", ...init })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    const detail = err.detail
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail))
  }
  return mapKeys<T>(await res.json(), toCamel)
}

function postJSON<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapKeys(body, toSnake)),
  })
}

function patchJSON<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapKeys(body, toSnake)),
  })
}

// ── Public API client ───────────────────────────────────────────────────────

export const api = {
  getBalances: () => apiFetch<BalanceSummary>("/balances"),

  getDonations: (params?: {
    donationType?: DonationType
    causeId?: string
    uncategorisedOnly?: boolean
  }) => {
    const q = new URLSearchParams()
    if (params?.donationType) q.set("donation_type", params.donationType)
    if (params?.causeId) q.set("cause_id", params.causeId)
    if (params?.uncategorisedOnly) q.set("uncategorised_only", "true")
    const qs = q.size ? "?" + q.toString() : ""
    return apiFetch<Donation[]>(`/donations${qs}`)
  },

  createDonation: (data: DonationCreate) => postJSON<Donation>("/donations", data),

  reclassifyDonation: (id: string, donationType: DonationType) =>
    patchJSON<Donation>(`/donations/${id}`, { donationType }),

  getCauses: () => apiFetch<Cause[]>("/causes"),

  getCauseProgress: (id: string) => apiFetch<CauseProgress>(`/causes/${id}/progress`),

  importBankStatement: async (file: File): Promise<ImportResult> => {
    const form = new FormData()
    form.append("file", file)
    const res = await fetch(`${BASE}/import/bank-statement`, { method: "POST", body: form })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }))
      throw new Error(typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail))
    }
    return mapKeys<ImportResult>(await res.json(), toCamel)
  },
}
