import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { BalanceCard } from "@/components/BalanceCard"
import { CauseProgressCard } from "@/components/CauseProgressCard"
import { DonationTable } from "@/components/DonationTable"
import { UncategorisedBanner } from "@/components/UncategorisedBanner"
import { api } from "@/lib/api"
import { formatPence } from "@/lib/currency"

export default async function DashboardPage() {
  const [summary, causes, donations, uncategorised] = await Promise.all([
    api.getBalances().catch(() => null),
    api.getCauses().catch(() => []),
    api.getDonations().catch(() => []),
    api.getDonations({ uncategorisedOnly: true }).catch(() => []),
  ])

  const causeProgress = await Promise.all(
    causes.map((c) => api.getCauseProgress(c.id).catch(() => null))
  ).then((results) => results.filter(Boolean))

  const apiDown = summary === null

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Fund Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {apiDown && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Backend API is unreachable. Start it with{" "}
          <code className="font-mono text-xs bg-red-100 px-1 rounded">
            cd backend && uvicorn app.main:app --reload
          </code>
        </div>
      )}

      {/* Uncategorised alert */}
      <UncategorisedBanner count={uncategorised.length} />

      {/* Fund balances */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-foreground">Fund Balances</h2>
          {summary && (
            <p className="text-sm text-muted-foreground tabular-nums">
              Total classified:{" "}
              <span className="font-medium text-foreground">
                {formatPence(summary.totalPence)}
              </span>
            </p>
          )}
        </div>

        <Separator className="mt-2 mb-4" />

        {summary && summary.balances.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summary.balances.map((b) => (
              <BalanceCard
                key={b.donationType}
                donationType={b.donationType}
                amountPence={b.amountPence}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-10 text-center">
            <p className="text-sm text-muted-foreground">No classified donations yet.</p>
            <Link
              href="/donations/new"
              className="mt-2 inline-block text-sm font-medium text-primary underline underline-offset-2"
            >
              Record the first donation →
            </Link>
          </div>
        )}
      </section>

      {/* Cause progress */}
      {causeProgress.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground">Cause Progress</h2>
          <Separator className="mt-2 mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {causeProgress.map(
              (p) => p && <CauseProgressCard key={p.causeId} progress={p} />
            )}
          </div>
        </section>
      )}

      {/* Recent donations */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Donations</h2>
          <span className="text-xs text-muted-foreground">Last 20</span>
        </div>
        <Separator className="mt-2 mb-4" />
        <DonationTable donations={donations} causes={causes} limit={20} />
      </section>
    </div>
  )
}
