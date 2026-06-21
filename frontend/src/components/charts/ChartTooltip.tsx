"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ChartTooltipProps extends React.ComponentProps<typeof Tooltip> {
  children: React.ReactNode
}

export function ChartTooltip({ children, ...props }: ChartTooltipProps) {
  return (
    <Tooltip trackCursorAxis="both" {...props}>
      {children}
    </Tooltip>
  )
}

export { TooltipTrigger as ChartTooltipTrigger }

interface ChartTooltipPopupProps
  extends React.ComponentProps<typeof TooltipContent> {
  children: React.ReactNode
}

export function ChartTooltipPopup({
  children,
  className,
  sideOffset = 12,
  ...props
}: ChartTooltipPopupProps) {
  return (
    <TooltipContent
      sideOffset={sideOffset}
      showArrow={false}
      className={cn(
        "pointer-events-none border border-border bg-card text-card-foreground shadow-md ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      {children}
    </TooltipContent>
  )
}
