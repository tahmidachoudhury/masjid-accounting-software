"use client"

import { ChartCard } from "./ChartCard"
import { LineChart } from "./LineChart"
import { donationsToTimeSeries, mergeDonationsTrendSeries } from "@/lib/chartData"
import type { LinePoint } from "@/lib/chart-utils"
import type { Donation } from "@/lib/api"

interface DonationsTrendChartProps {
  donations: Donation[]
  cumulativePoints: LinePoint[]
}

export function DonationsTrendChart({
  donations,
  cumulativePoints,
}: DonationsTrendChartProps) {
  const livePoints = donationsToTimeSeries(donations, "week")
  const points = mergeDonationsTrendSeries(cumulativePoints, livePoints)

  return (
    <ChartCard
      title="Donations Over Time"
      subtitle="Classified donations by week"
      delay={0.1}
    >
      <LineChart
        showArea={false}
        series={[
          {
            label: "Donations",
            color: "var(--primary)",
            points,
          },
        ]}
      />
    </ChartCard>
  )
}
