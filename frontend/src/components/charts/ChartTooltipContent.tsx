import { formatChartValue } from "@/lib/chart-utils"

interface ChartTooltipContentProps {
  label: string
  value: number
  percentage?: number
  color?: string
}

export function ChartTooltipContent({
  label,
  value,
  percentage,
  color,
}: ChartTooltipContentProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        {color && (
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
        )}
        <span className="font-medium">{label}</span>
      </div>
      <span className="tabular-nums text-muted-foreground">
        {formatChartValue(value)}
        {percentage !== undefined && ` (${percentage.toFixed(0)}%)`}
      </span>
    </div>
  )
}
