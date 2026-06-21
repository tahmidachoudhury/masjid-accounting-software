"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  ChartTooltip,
  ChartTooltipPopup,
  ChartTooltipTrigger,
} from "./ChartTooltip"
import {
  buildLinePath,
  pickXAxisTickIndices,
  type LineSeries,
} from "@/lib/chart-utils"
import { motion as motionTokens } from "@/lib/design-tokens"
import { ChartTooltipContent } from "./ChartTooltipContent"

interface LineChartProps {
  series: LineSeries[]
  width?: number
  height?: number
  showArea?: boolean
  maxXTicks?: number
}

export function LineChart({
  series,
  width = 400,
  height = 200,
  showArea = true,
  maxXTicks = 6,
}: LineChartProps) {
  const reducedMotion = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const primary = series[0]
  if (!primary || primary.points.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ width, height }}
      >
        No data
      </div>
    )
  }

  const { areaPath, scaled } = buildLinePath(primary.points, width, height)
  const xTickIndices = pickXAxisTickIndices(primary.points.length, maxXTicks)

  return (
    <div className="relative w-full">
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {showArea && areaPath && (
          <motion.path
            d={areaPath}
            fill="url(#lineAreaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reducedMotion ? 0 : 0.6,
              delay: reducedMotion ? 0 : motionTokens.durationLine * 0.5,
            }}
          />
        )}

        {series.map((s, si) => {
          const { linePath: sPath } = buildLinePath(s.points, width, height)
          return (
            <motion.path
              key={s.label}
              d={sPath}
              fill="none"
              stroke={s.color}
              strokeWidth={si === 0 ? 2.5 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={si > 0 ? "4 4" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0 : motionTokens.durationLine,
                ease: motionTokens.ease,
                delay: reducedMotion ? 0 : si * 0.2,
              }}
            />
          )
        })}

        {scaled.map((p, i) => {
          const point = primary.points[i]
          if (!point) return null

          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 5 : 3}
                fill={primary.color}
                className="pointer-events-none transition-all"
              />
              <ChartTooltip>
                <ChartTooltipTrigger
                  delay={0}
                  closeDelay={0}
                  render={
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={10}
                      fill="transparent"
                      className="cursor-pointer outline-none"
                    />
                  }
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                <ChartTooltipPopup>
                  <ChartTooltipContent
                    label={point.label ?? primary.label}
                    value={point.y}
                    color={primary.color}
                  />
                </ChartTooltipPopup>
              </ChartTooltip>
            </g>
          )
        })}

        {xTickIndices.length > 0 && (
          <g>
            {xTickIndices.map((i) => {
              const p = scaled[i]
              const label = primary.points[i]?.label
              if (!p || !label) return null

              const textAnchor =
                i === 0 ? "start" : i === primary.points.length - 1 ? "end" : "middle"

              return (
                <text
                  key={i}
                  x={p.x}
                  y={height - 4}
                  textAnchor={textAnchor}
                  className="fill-muted-foreground text-[9px] uppercase"
                >
                  {label}
                </text>
              )
            })}
          </g>
        )}
      </svg>
    </div>
  )
}
