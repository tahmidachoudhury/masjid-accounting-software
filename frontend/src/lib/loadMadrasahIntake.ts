import { readFile } from "fs/promises"
import path from "path"
import type { MadrasahIntakeFile } from "./madrasahIntake"

export async function loadMadrasahIntake(): Promise<MadrasahIntakeFile | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "madrasah-intake.json")
    const raw = await readFile(filePath, "utf-8")
    return JSON.parse(raw) as MadrasahIntakeFile
  } catch {
    return null
  }
}
