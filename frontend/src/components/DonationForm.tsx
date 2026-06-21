"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Cause, type DonationType } from "@/lib/api"
import { useTreasury } from "@/lib/demoStore"
import { FUND_CONFIG, CLASSIFIABLE_TYPES } from "@/lib/fundConfig"

interface DonationFormProps {
  causes: Cause[]
}

export function DonationForm({ causes }: DonationFormProps) {
  const router = useRouter()
  const { createDonation } = useTreasury()
  const [loading, setLoading] = useState(false)

  const [amountGbp, setAmountGbp] = useState("")
  const [donationType, setDonationType] = useState<DonationType | "">("")
  const [causeId, setCauseId] = useState<string>("")
  const [giftAid, setGiftAid] = useState(false)
  const [donorRef, setDonorRef] = useState("")

  // When a cause is selected, restrict available types to its allowed_types
  const selectedCause = causes.find((c) => c.id === causeId)
  const availableTypes =
    selectedCause && selectedCause.allowedTypes.length > 0
      ? CLASSIFIABLE_TYPES.filter((t) => selectedCause.allowedTypes.includes(t))
      : CLASSIFIABLE_TYPES

  // If the currently selected type is no longer available after cause change, clear it
  const effectiveType =
    donationType && availableTypes.includes(donationType as (typeof CLASSIFIABLE_TYPES)[number])
      ? donationType
      : ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!effectiveType) return

    const amountParsed = parseFloat(amountGbp)
    if (isNaN(amountParsed) || amountParsed <= 0) {
      toast.error("Enter a valid amount in pounds (e.g. 100.00)")
      return
    }
    const amountPence = Math.round(amountParsed * 100)

    setLoading(true)
    try {
      createDonation({
        amountPence,
        donationType: effectiveType,
        causeId: causeId || null,
        giftAid,
        donorRef: donorRef.trim() || null,
        source: "manual",
      })
      toast.success("Donation recorded")
      router.push("/")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record donation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Amount */}
      <div className="space-y-1.5">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount (£)
        </label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={amountGbp}
          onChange={(e) => setAmountGbp(e.target.value)}
          required
          className="tabular-nums"
        />
      </div>

      {/* Cause (optional — pick first to filter types) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">
          Cause <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Select
          value={causeId}
          onValueChange={(v) => {
            setCauseId(!v || v === "__none" ? "" : v)
            setDonationType("") // reset type when cause changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="No specific cause" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none">No specific cause</SelectItem>
            {causes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
                {c.allowedTypes.length > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({c.allowedTypes.map((t) => FUND_CONFIG[t].label).join(", ")})
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCause?.allowedTypes && selectedCause.allowedTypes.length > 0 && (
          <p className="text-xs text-muted-foreground">
            This cause accepts:{" "}
            {selectedCause.allowedTypes.map((t) => FUND_CONFIG[t].label).join(", ")}
          </p>
        )}
      </div>

      {/* Donation type */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Donation type</label>
        <Select
          value={effectiveType}
          onValueChange={(v) => setDonationType(v as DonationType)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type…" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((t) => (
              <SelectItem key={t} value={t}>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: FUND_CONFIG[t].color }}
                    aria-hidden
                  />
                  {FUND_CONFIG[t].label}
                  {FUND_CONFIG[t].restricted && (
                    <span className="text-xs text-muted-foreground">(restricted)</span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reference */}
      <div className="space-y-1.5">
        <label htmlFor="ref" className="block text-sm font-medium">
          Donor reference <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input
          id="ref"
          type="text"
          placeholder="Name, transaction ref, etc."
          value={donorRef}
          onChange={(e) => setDonorRef(e.target.value)}
        />
      </div>

      {/* Gift Aid */}
      <div className="flex items-center gap-3">
        <input
          id="gift-aid"
          type="checkbox"
          checked={giftAid}
          onChange={(e) => setGiftAid(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary focus:ring-2 focus:ring-ring"
        />
        <label htmlFor="gift-aid" className="text-sm">
          Gift Aid eligible{" "}
          <span className="text-xs text-muted-foreground">
            (donor is a UK taxpayer and has consented)
          </span>
        </label>
      </div>

      <Button type="submit" disabled={loading || !effectiveType} className="w-full sm:w-auto">
        {loading ? "Recording…" : "Record donation"}
      </Button>
    </form>
  )
}
