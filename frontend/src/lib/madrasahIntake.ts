import type { LinePoint } from "./chart-utils"

export interface MadrasahIntakePoint {
  date: string
  label: string
  intake: number
  cumulativeEnrolled: number
}

export interface MadrasahIntakeFile {
  granularity: "month"
  academicYear: string
  unit: "students"
  description?: string
  series: {
    label: string
    points: MadrasahIntakePoint[]
  }[]
}

export function getMadrasahIntakePoints(file: MadrasahIntakeFile): MadrasahIntakePoint[] {
  return file.series[0]?.points ?? []
}

/** Monthly new enrollments — suitable for bar charts. */
export function madrasahIntakeToBarItems(file: MadrasahIntakeFile) {
  return getMadrasahIntakePoints(file).map((p) => ({
    label: p.label,
    value: p.intake,
  }))
}

/** Cumulative enrolled headcount — suitable for line charts. */
export function madrasahIntakeToLinePoints(file: MadrasahIntakeFile): LinePoint[] {
  return getMadrasahIntakePoints(file).map((p) => ({
    x: 0,
    y: p.cumulativeEnrolled,
    label: p.label,
  }))
}

/** Monthly intake counts as line series (non-cumulative). */
export function madrasahIntakeToMonthlyLinePoints(file: MadrasahIntakeFile): LinePoint[] {
  return getMadrasahIntakePoints(file).map((p) => ({
    x: 0,
    y: p.intake,
    label: p.label,
  }))
}

export function madrasahIntakeTotal(file: MadrasahIntakeFile): number {
  const points = getMadrasahIntakePoints(file)
  return points.reduce((sum, p) => sum + p.intake, 0)
}

export function madrasahIntakeLatestMonth(file: MadrasahIntakeFile): MadrasahIntakePoint | null {
  const points = getMadrasahIntakePoints(file)
  return points[points.length - 1] ?? null
}

/** Month-over-month change in new enrollments (latest vs prior month). */
export function madrasahIntakeMonthChange(file: MadrasahIntakeFile): number | null {
  const points = getMadrasahIntakePoints(file)
  if (points.length < 2) return null

  const latest = points[points.length - 1]
  const previous = points[points.length - 2]

  if (previous.intake === 0) {
    return latest.intake === 0 ? 0 : null
  }

  return ((latest.intake - previous.intake) / previous.intake) * 100
}
