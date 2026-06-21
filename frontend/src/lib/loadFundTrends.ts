import { readFile } from "fs/promises"
import path from "path"
import type { FundTrendsFile } from "./balanceTrends"

export async function loadFundTrends(): Promise<FundTrendsFile | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "fund-balance-trends.json")
    const raw = await readFile(filePath, "utf-8")
    return JSON.parse(raw) as FundTrendsFile
  } catch {
    return null
  }
}
