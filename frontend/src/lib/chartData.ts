import type { TypeBalance, Donation, CauseProgress } from "./api"
import type { DonutChartData } from "@/components/charts/DonutChart"
import type { LinePoint } from "./chart-utils"
import { chartPalette } from "./design-tokens"
import { FUND_CONFIG } from "./fundConfig"

export interface CumulativeDataPoint {
  date: string
  label: string
  cumulativePence: number
}

export interface CumulativeDataFile {
  granularity: "day" | "week"
  currency: string
  unit: "pence"
  description?: string
  series: {
    label: string
    points: CumulativeDataPoint[]
  }[]
}

export function cumulativeFileToLinePoints(file: CumulativeDataFile): LinePoint[] {
  const primary = file.series[0]
  if (!primary) return []

  return primary.points
    .map((p, i, arr) => {
      const prev = i > 0 ? arr[i - 1].cumulativePence : 0
      const weeklyPence = p.cumulativePence - prev
      return {
        x: 0,
        y: weeklyPence,
        label: p.label,
      }
    })
    .filter((p) => p.y > 0)
}

export function mergeDonationsTrendSeries(
  staticPoints: LinePoint[],
  livePoints: LinePoint[]
): LinePoint[] {
  if (staticPoints.length === 0) return livePoints
  if (livePoints.length === 0) return staticPoints
  return staticPoints
}

export function balancesToChartData(balances: TypeBalance[]): DonutChartData[] {
  return balances
    .filter((b) => b.amountPence > 0)
    .sort((a, b) => b.amountPence - a.amountPence)
    .map((b, i) => ({
      label: FUND_CONFIG[b.donationType].label,
      value: b.amountPence,
      color: chartPalette[i % chartPalette.length],
    }))
}

export function causeProgressToChartData(progress: CauseProgress[]): DonutChartData[] {
  return progress
    .filter((p) => p.raisedPence > 0)
    .map((p, i) => ({
      label: p.name,
      value: p.raisedPence,
      color: `var(--chart-${(i % 5) + 1})`,
    }))
}

export interface CauseProgressBarItem {
  label: string
  value: number
  raisedPence: number
  targetPence: number
}

export function causeProgressToBarItems(progress: CauseProgress[]): CauseProgressBarItem[] {
  return progress
    .filter((p) => p.targetPence !== null && p.percentage !== null)
    .map((p) => ({
      label: p.name,
      value: Math.min(p.percentage!, 100),
      raisedPence: p.raisedPence,
      targetPence: p.targetPence!,
    }))
}

export function donationsToTimeSeries(
  donations: Donation[],
  granularity: "day" | "week" = "week"
): LinePoint[] {
  const classified = donations.filter((d) => d.donationType !== "uncategorised")
  if (classified.length === 0) return []

  const buckets = new Map<string, number>()

  for (const d of classified) {
    const date = new Date(d.createdAt)
    let key: string

    if (granularity === "day") {
      key = date.toISOString().slice(0, 10)
    } else {
      const weekStart = getWeekStart(date)
      key = weekStart.toISOString().slice(0, 10)
    }

    buckets.set(key, (buckets.get(key) ?? 0) + d.amountPence)
  }

  const sorted = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b))

  return sorted
    .map(([key, amount]) => {
      const date = new Date(key)
      const label =
        granularity === "day"
          ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
          : date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      return { x: 0, y: amount, label }
    })
    .filter((p) => p.y > 0)
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}
