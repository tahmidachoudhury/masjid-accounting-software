"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FundBadge } from "@/components/FundBadge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { formatPence } from "@/lib/currency"
import { api, type Donation, type Cause, type DonationType } from "@/lib/api"
import { CLASSIFIABLE_TYPES, FUND_CONFIG } from "@/lib/fundConfig"

interface DonationTableProps {
  donations: Donation[]
  causes: Cause[]
  limit?: number
}

export function DonationTable({ donations, causes, limit }: DonationTableProps) {
  const router = useRouter()
  const [localDonations, setLocalDonations] = useState(donations)
  const [classifyingId, setClassifyingId] = useState<string | null>(null)
  const causeMap = Object.fromEntries(causes.map((c) => [c.id, c.name]))
  const causeById = Object.fromEntries(causes.map((c) => [c.id, c]))
  const rows = limit ? localDonations.slice(0, limit) : localDonations

  async function classifyDonation(donation: Donation, donationType: DonationType) {
    setClassifyingId(donation.id)
    try {
      const updated = await api.reclassifyDonation(donation.id, donationType)
      setLocalDonations((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      )
      toast.success(`Donation classified as ${FUND_CONFIG[donationType].label}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not classify donation")
    } finally {
      setClassifyingId(null)
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-12 text-center">
        <p className="text-sm text-muted-foreground">No donations recorded yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Use &ldquo;Record Donation&rdquo; to add one.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-32">
              Amount
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cause
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reference
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-28">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((d) => (
            <TableRow
              key={d.id}
              className={d.donationType === "uncategorised" ? "bg-warning/10" : ""}
            >
              <TableCell className="font-medium tabular-nums">
                {formatPence(d.amountPence)}
              </TableCell>
              <TableCell>
                {d.donationType === "uncategorised" ? (
                  <Select
                    value={d.donationType}
                    onValueChange={(value) => {
                      if (value && value !== "uncategorised") {
                        void classifyDonation(d, value as DonationType)
                      }
                    }}
                    disabled={classifyingId === d.id}
                  >
                    <SelectTrigger
                      aria-label={`Classify ${formatPence(d.amountPence)} donation`}
                      className="h-auto border-0 bg-transparent p-0 shadow-none hover:bg-transparent focus-visible:ring-2"
                    >
                      <FundBadge type="uncategorised" />
                    </SelectTrigger>
                    <SelectContent align="start" className="min-w-48">
                      {(d.causeId && causeById[d.causeId]?.allowedTypes.length
                        ? causeById[d.causeId].allowedTypes.filter(
                            (type) => type !== "uncategorised"
                          )
                        : CLASSIFIABLE_TYPES
                      ).map((type) => (
                        <SelectItem key={type} value={type}>
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: FUND_CONFIG[type].chartColor }}
                            aria-hidden
                          />
                          {FUND_CONFIG[type].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <FundBadge type={d.donationType} />
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {d.causeId ? causeMap[d.causeId] ?? "—" : "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {d.donorRef ?? "—"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(d.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
