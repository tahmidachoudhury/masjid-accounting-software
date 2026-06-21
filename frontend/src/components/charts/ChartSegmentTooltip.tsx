"use client"

import { ChartTooltip, ChartTooltipPopup, ChartTooltipTrigger } from "./ChartTooltip"
import { ChartTooltipContent } from "./ChartTooltipContent"

interface ChartSegmentTooltipProps {
  label: string
  value: number
  percentage?: number
  color: string
  path: string
  children: React.ReactNode
}

export function ChartSegmentTooltip({
  label,
  value,
  percentage,
  color,
  path,
  children,
}: ChartSegmentTooltipProps) {
  return (
    <ChartTooltip>
      <g>
        {children}
        <ChartTooltipTrigger
          delay={0}
          closeDelay={0}
          render={
            <path
              d={path}
              fill="transparent"
              className="cursor-pointer outline-none"
            />
          }
        />
      </g>
      <ChartTooltipPopup>
        <ChartTooltipContent
          label={label}
          value={value}
          percentage={percentage}
          color={color}
        />
      </ChartTooltipPopup>
    </ChartTooltip>
  )
}
