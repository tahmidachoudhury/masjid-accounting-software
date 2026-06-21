"use client"

import { motion, useReducedMotion } from "framer-motion"
import { buildPieSegments } from "@/lib/chart-utils"
import { chartFillOpacity, motion as motionTokens } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"
import { ChartLegend } from "./ChartLegend"
import { ChartPlot } from "./ChartPlot"
import { ChartSegmentTooltip } from "./ChartSegmentTooltip"

export interface DonutChartData {
  label: string
  value: number
  color: string
}

const VIEW_BOX = 200

interface DonutChartProps {
  data: DonutChartData[]
  innerRadiusRatio?: number
  centerLabel?: string
  centerValue?: string
  className?: string
  /** Fill the shared chart plot height (matches line charts). */
  fillPlot?: boolean
}

export function DonutChart({
  data,
  innerRadiusRatio = 0.6,
  centerLabel,
  centerValue,
  className,
  fillPlot = false,
}: DonutChartProps) {
  const reducedMotion = useReducedMotion()
  const segments = buildPieSegments(data, VIEW_BOX, innerRadiusRatio)
  const center = VIEW_BOX / 2

  if (segments.length === 0) {
    const empty = (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No data
      </div>
    )
    return fillPlot ? (
      <ChartPlot>{empty}</ChartPlot>
    ) : (
      <div
        className={cn(
          "mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center text-sm text-muted-foreground",
          className
        )}
      >
        No data
      </div>
    )
  }

  const ring = (
    <div className="relative h-full w-full">
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Donut chart"
      >
        {segments.map((seg, i) => (
          <ChartSegmentTooltip
            key={seg.label}
            label={seg.label}
            value={seg.value}
            percentage={seg.percentage}
            color={seg.color}
            path={seg.path}
          >
            <motion.path
              d={seg.path}
              fill={seg.color}
              fillOpacity={chartFillOpacity}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reducedMotion ? 0 : motionTokens.durationSlow,
                delay: reducedMotion ? 0 : i * motionTokens.stagger,
                ease: motionTokens.ease,
              }}
              style={{ transformOrigin: `${center}px ${center}px` }}
              className="pointer-events-none"
            />
          </ChartSegmentTooltip>
        ))}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-base font-semibold tabular-nums text-foreground">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-xs text-muted-foreground">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  )

  if (fillPlot) {
    return (
      <div className={cn("flex w-full flex-col", className)}>
        <ChartPlot>{ring}</ChartPlot>
        <ChartLegend
          items={segments.map((s) => ({
            label: s.label,
            color: s.color,
            value: s.value,
            percentage: s.percentage,
          }))}
        />
      </div>
    )
  }

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="relative mx-auto aspect-square w-full max-w-[200px]">{ring}</div>
      <ChartLegend
        items={segments.map((s) => ({
          label: s.label,
          color: s.color,
          value: s.value,
          percentage: s.percentage,
        }))}
      />
    </div>
  )
}
