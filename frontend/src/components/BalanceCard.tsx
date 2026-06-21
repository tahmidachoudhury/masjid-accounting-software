import { FUND_CONFIG } from "@/lib/fundConfig"
import { formatPence } from "@/lib/currency"
import { formatTrendPercent } from "@/lib/balanceTrends"
import { cn } from "@/lib/utils"
import type { DonationType } from "@/lib/api"

interface BalanceCardProps {
  donationType: DonationType
  amountPence: number
  changePercent?: number | null
  periodLabel?: string
}

function TrendBadge({ value }: { value: number }) {
  const isPositive = value > 0
  const isNegative = value < 0
  const isNeutral = value === 0

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        isPositive && "bg-success/15 text-success",
        isNegative && "bg-destructive/15 text-destructive",
        isNeutral && "bg-muted text-muted-foreground"
      )}
    >
      {formatTrendPercent(value)}
    </span>
  )
}

export function BalanceCard({
  donationType,
  amountPence,
  changePercent = null,
  periodLabel,
}: BalanceCardProps) {
  const cfg = FUND_CONFIG[donationType]

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 shadow-card"
      role="region"
      aria-label={`${cfg.label} fund balance`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground">{cfg.label}</p>
        {cfg.restricted && (
          <span className="shrink-0 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning uppercase tracking-wider">
            Restricted
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tabular-nums text-foreground">
          {formatPence(amountPence)}
        </p>
        {changePercent !== null && <TrendBadge value={changePercent} />}
      </div>

      {periodLabel && changePercent !== null && (
        <p className="mt-1.5 text-[10px] text-muted-foreground">{periodLabel}</p>
      )}
    </div>
  )
}

interface TotalBalanceCardProps {
  totalPence: number
  changePercent?: number | null
  periodLabel?: string
}

export function TotalBalanceCard({
  totalPence,
  changePercent = null,
  periodLabel,
}: TotalBalanceCardProps) {
  return (
    <div
      className="rounded-xl border border-primary/30 bg-card p-5 shadow-card ring-1 ring-primary/20"
      role="region"
      aria-label="Total classified fund balance"
    >
      <p className="text-sm text-muted-foreground">Total Classified</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tabular-nums text-foreground">
          {formatPence(totalPence)}
        </p>
        {changePercent !== null && <TrendBadge value={changePercent} />}
      </div>
      {periodLabel && changePercent !== null && (
        <p className="mt-1.5 text-[10px] text-muted-foreground">{periodLabel}</p>
      )}
    </div>
  )
}
