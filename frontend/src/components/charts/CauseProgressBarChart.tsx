"use client"

import { ChartCard } from "./ChartCard"
import { HorizontalBarChart } from "./HorizontalBarChart"
import { causeProgressToBarItems } from "@/lib/chartData"
import type { CauseProgress } from "@/lib/api"

interface CauseProgressBarChartProps {
  progress: CauseProgress[]
}

export function CauseProgressBarChart({ progress }: CauseProgressBarChartProps) {
  const items = causeProgressToBarItems(progress)

  return (
    <ChartCard
      title="Cause Progress"
      subtitle="Fundraising progress toward target"
      delay={0.2}
    >
      {items.length > 0 ? (
        <HorizontalBarChart items={items} />
      ) : (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No causes with targets set
        </div>
      )}
    </ChartCard>
  )
}
