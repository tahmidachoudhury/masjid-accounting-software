"use client"

import { motion, useReducedMotion } from "framer-motion"
import { motion as motionTokens } from "@/lib/design-tokens"

export interface HorizontalBarItem {
  label: string
  value: number
}

interface HorizontalBarChartProps {
  items: HorizontalBarItem[]
  showAxis?: boolean
}

const AXIS_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export function HorizontalBarChart({ items, showAxis = true }: HorizontalBarChartProps) {
  const reducedMotion = useReducedMotion()

  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No data
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3">
          <span
            className="w-28 shrink-0 truncate text-xs text-muted-foreground"
            title={item.label}
          >
            {item.label}
          </span>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={{ width: reducedMotion ? `${item.value}%` : "0%" }}
              animate={{ width: `${item.value}%` }}
              transition={{
                duration: reducedMotion ? 0 : motionTokens.durationSlow,
                delay: reducedMotion ? 0 : i * motionTokens.stagger,
                ease: motionTokens.ease,
              }}
              role="progressbar"
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${item.label}: ${item.value}%`}
            />
          </div>
        </div>
      ))}

      {showAxis && (
        <div className="flex items-center gap-3 pt-1">
          <span className="w-28 shrink-0" aria-hidden />
          <div className="flex flex-1 justify-between">
            {AXIS_TICKS.map((tick) => (
              <span
                key={tick}
                className="text-[10px] text-muted-foreground tabular-nums"
              >
                {tick}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
