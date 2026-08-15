import type { Cause, Donation } from "@/lib/api"
import seed from "@/lib/demo-seed.json"

export const DEMO_CAUSES = seed.causes as Cause[]

export const DEMO_DONATIONS = seed.donations as Donation[]
