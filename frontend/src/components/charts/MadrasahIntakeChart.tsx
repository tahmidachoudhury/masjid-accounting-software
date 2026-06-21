"use client"

import { ChartCard } from "./ChartCard"
import { LineChart } from "./LineChart"
import {
  madrasahIntakeToMonthlyLinePoints,
  type MadrasahIntakeFile,
} from "@/lib/madrasahIntake"

interface MadrasahIntakeChartProps {
  data: MadrasahIntakeFile
}

export function MadrasahIntakeChart({ data }: MadrasahIntakeChartProps) {
  const points = madrasahIntakeToMonthlyLinePoints(data)

  return (
    <ChartCard
      title="Madrasah Intake"
      subtitle={`New enrollments per month · ${data.academicYear}`}
      delay={0.15}
    >
      <LineChart
        series={[
          {
            label: "New enrollments",
            color: "var(--chart-2)",
            points,
          },
        ]}
        showArea
      />
    </ChartCard>
  )
}
