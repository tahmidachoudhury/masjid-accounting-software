"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Separator } from "@/components/ui/separator"
import { BalanceCard } from "@/components/BalanceCard"
import { CauseProgressCard } from "@/components/CauseProgressCard"
import { DonationTable } from "@/components/DonationTable"
import { UncategorisedBanner } from "@/components/UncategorisedBanner"
import { useTreasury } from "@/lib/demoStore"
import { formatPence } from "@/lib/currency"

export default function DashboardPage() {
  const { causes, donations } = useTreasury()
  const balances = useMemo(() => Object.entries(donations.filter((d) => d.donationType !== "uncategorised").reduce<Record<string, number>>((all, d) => ({ ...all, [d.donationType]: (all[d.donationType] ?? 0) + d.amountPence }), {})).map(([donationType, amountPence]) => ({ donationType: donationType as Parameters<typeof BalanceCard>[0]["donationType"], amountPence })), [donations])
  const totalPence = balances.reduce((total, balance) => total + balance.amountPence, 0)
  const progress = causes.map((cause) => { const raisedPence = donations.filter((d) => d.causeId === cause.id).reduce((total, d) => total + d.amountPence, 0); return { causeId: cause.id, name: cause.name, raisedPence, targetPence: cause.targetPence, percentage: cause.targetPence ? raisedPence / cause.targetPence * 100 : null } })
  const uncategorised = donations.filter((d) => d.donationType === "uncategorised")

  return <div className="space-y-10">
    <div><h1 className="text-3xl font-semibold tracking-tight text-foreground">Fund Dashboard</h1><p className="mt-1 text-sm text-muted-foreground">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></div>
    <UncategorisedBanner count={uncategorised.length} />
    <section><div className="flex items-baseline justify-between"><h2 className="text-lg font-semibold text-foreground">Fund Balances</h2><p className="text-sm text-muted-foreground tabular-nums">Total classified: <span className="font-medium text-foreground">{formatPence(totalPence)}</span></p></div><Separator className="mt-2 mb-4" />
      {balances.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{balances.map((b) => <BalanceCard key={b.donationType} {...b} />)}</div> : <div className="rounded-lg border border-dashed border-border py-10 text-center"><p className="text-sm text-muted-foreground">No classified donations yet.</p><Link href="/donations/new" className="mt-2 inline-block text-sm font-medium text-primary underline underline-offset-2">Record the first donation →</Link></div>}</section>
    <section><h2 className="text-lg font-semibold text-foreground">Cause Progress</h2><Separator className="mt-2 mb-4" /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{progress.map((p) => <CauseProgressCard key={p.causeId} progress={p} />)}</div></section>
    <section><div className="flex items-baseline justify-between"><h2 className="text-lg font-semibold text-foreground">Recent Donations</h2><span className="text-xs text-muted-foreground">Last 20</span></div><Separator className="mt-2 mb-4" /><DonationTable donations={donations} causes={causes} limit={20} /></section>
  </div>
}
