import { cn } from "@/lib/utils"
import { chartPlotHeight } from "@/lib/design-tokens"

interface ChartPlotProps {
  children: React.ReactNode
  className?: string
}

export function ChartPlot({ children, className }: ChartPlotProps) {
  return (
    <div
      className={cn("w-full", className)}
      style={{ height: chartPlotHeight }}
    >
      {children}
    </div>
  )
}
