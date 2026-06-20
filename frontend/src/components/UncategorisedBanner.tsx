import Link from "next/link"

interface UncategorisedBannerProps {
  count: number
}

export function UncategorisedBanner({ count }: UncategorisedBannerProps) {
  if (count === 0) return null

  return (
    <div
      role="alert"
      className="rounded-lg border border-dashed border-amber-400 bg-amber-50 p-4"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-amber-600 shrink-0" aria-hidden>⚠</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">
            {count} donation{count !== 1 ? "s" : ""} awaiting classification
          </p>
          <p className="mt-0.5 text-xs text-amber-800">
            These are excluded from all fund balances until a treasurer assigns a type.
            Restricted funds (zakat, waqf, etc.) must be correctly labelled before any
            disbursement.
          </p>
          <Link
            href="/import"
            className="mt-2 inline-block text-xs font-semibold text-amber-900 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded"
          >
            Classify now →
          </Link>
        </div>
      </div>
    </div>
  )
}
