import { readFile } from "fs/promises"
import path from "path"
import {
  cumulativeFileToLinePoints,
  type CumulativeDataFile,
} from "@/lib/chartData"
import type { LinePoint } from "@/lib/chart-utils"

export async function loadCumulativeData(): Promise<LinePoint[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "cumulative-data.json")
    const raw = await readFile(filePath, "utf-8")
    const data = JSON.parse(raw) as CumulativeDataFile
    return cumulativeFileToLinePoints(data)
  } catch {
    return []
  }
}
