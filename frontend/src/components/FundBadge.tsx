import { FUND_CONFIG } from "@/lib/fundConfig"
import type { DonationType } from "@/lib/api"

interface FundBadgeProps {
  type: DonationType
  size?: "sm" | "md"
}

export function FundBadge({ type, size = "sm" }: FundBadgeProps) {
  const cfg = FUND_CONFIG[type]
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${padding} ${type === "uncategorised" ? "border border-dashed" : ""}`}
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        borderColor: type === "uncategorised" ? cfg.color : undefined,
      }}
    >
      {cfg.restricted && (
        <span className="mr-1 text-[0.6rem]" aria-label="Restricted fund">
          ●
        </span>
      )}
      {cfg.label}
    </span>
  )
}
