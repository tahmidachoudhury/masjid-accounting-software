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

// ── Fetch helpers ───────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, { cache: "no-store", ...init })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(typeof err.error === "string" ? err.error : JSON.stringify(err))
  }
  return res.json() as Promise<T>
}

function postJSON<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function patchJSON<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
    if (params?.donationType) q.set("donationType", params.donationType)
    if (params?.causeId) q.set("causeId", params.causeId)
    if (params?.uncategorisedOnly) q.set("uncategorisedOnly", "true")
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
    const res = await fetch("/api/import/bank-statement", { method: "POST", body: form })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(typeof err.error === "string" ? err.error : JSON.stringify(err))
    }
    return res.json() as Promise<ImportResult>
  },
}
