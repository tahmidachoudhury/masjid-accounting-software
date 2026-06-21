export type DonationType =
  | "zakat" | "sadaqah" | "lillah" | "zakat_al_fitr" | "fidya"
  | "kaffarah" | "waqf" | "general" | "uncategorised"

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

export interface CauseImage {
  id: string
  url: string
  alt: string
  caption?: string
}

export interface CauseContentUpdate {
  description: string
  story: string
  impact: string
  images: CauseImage[]
}

export interface Cause {
  id: string
  name: string
  targetPence: number | null
  deadline: string | null
  allowedTypes: DonationType[]
  createdAt: string
  description?: string
  story?: string
  impact?: string
  images?: CauseImage[]
}

export interface TypeBalance { donationType: DonationType; amountPence: number }
export interface BalanceSummary { balances: TypeBalance[]; totalPence: number }
export interface CauseProgress { causeId: string; name: string; raisedPence: number; targetPence: number | null; percentage: number | null }
export interface ImportRecord { row: number; donationId: string; amountPence: number; donationType: DonationType; donorRef: string | null }
export interface ImportError { row: number; error: string; rowData: Record<string, string> }
export interface ImportResult {
  classified: ImportRecord[]
  uncategorised: ImportRecord[]
  errors: ImportError[]
  summary: { classifiedCount: number; uncategorisedCount: number; errorCount: number }
}
