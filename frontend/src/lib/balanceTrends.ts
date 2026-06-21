import type { Donation, DonationType } from "./api"

export interface FundTrendsFile {
  periodLabel: string
  trends: Partial<Record<DonationType, number>>
}

/** Month-over-month inflow change for a donation type. */
export function computeInflowChangePercent(
  donations: Donation[],
  donationType: DonationType
): number | null {
  if (donationType === "uncategorised") return null

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const filtered = donations.filter((d) => d.donationType === donationType)

  const thisMonth = filtered
    .filter((d) => new Date(d.createdAt) >= thisMonthStart)
    .reduce((sum, d) => sum + d.amountPence, 0)

  const lastMonth = filtered
    .filter((d) => {
      const date = new Date(d.createdAt)
      return date >= lastMonthStart && date < thisMonthStart
    })
    .reduce((sum, d) => sum + d.amountPence, 0)

  if (lastMonth === 0) {
    if (thisMonth === 0) return 0
    return null
  }

  return ((thisMonth - lastMonth) / lastMonth) * 100
}

/** Balance growth since end of previous calendar month. */
export function computeBalanceChangePercent(
  donations: Donation[],
  donationType: DonationType,
  currentBalancePence: number
): number | null {
  if (donationType === "uncategorised") return null

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const thisMonthDonations = donations
    .filter((d) => d.donationType === donationType && new Date(d.createdAt) >= thisMonthStart)
    .reduce((sum, d) => sum + d.amountPence, 0)

  const previousBalance = currentBalancePence - thisMonthDonations

  if (previousBalance <= 0) return null

  return (thisMonthDonations / previousBalance) * 100
}

export function resolveTrendPercent(
  donations: Donation[],
  donationType: DonationType,
  currentBalancePence: number,
  fallbackTrends: FundTrendsFile | null
): number | null {
  const fromInflow = computeInflowChangePercent(donations, donationType)
  if (fromInflow !== null) return fromInflow

  const fromBalance = computeBalanceChangePercent(
    donations,
    donationType,
    currentBalancePence
  )
  if (fromBalance !== null) return fromBalance

  const fallback = fallbackTrends?.trends[donationType]
  return fallback !== undefined ? fallback : null
}

export function computeTotalTrendPercent(
  balances: { donationType: DonationType; amountPence: number }[],
  donations: Donation[],
  fallbackTrends: FundTrendsFile | null
): number | null {
  const total = balances.reduce((sum, b) => sum + b.amountPence, 0)
  if (total === 0) return null

  let weightedSum = 0
  let weightTotal = 0

  for (const b of balances) {
    const trend = resolveTrendPercent(
      donations,
      b.donationType,
      b.amountPence,
      fallbackTrends
    )
    if (trend !== null) {
      weightedSum += trend * b.amountPence
      weightTotal += b.amountPence
    }
  }

  if (weightTotal === 0) return null
  return weightedSum / weightTotal
}

export function formatTrendPercent(value: number): string {
  const sign = value > 0 ? "+" : ""
  const abs = Math.abs(value)
  if (abs >= 10) return `${sign}${value.toFixed(1)}%`
  if (abs >= 1) return `${sign}${value.toFixed(1)}%`
  return `${sign}${value.toFixed(2)}%`
}
