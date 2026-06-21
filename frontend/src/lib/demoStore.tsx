"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { DEMO_CAUSES, DEMO_DONATIONS } from "@/lib/demoData"
import type { Cause, Donation, DonationCreate, DonationType, ImportResult } from "@/lib/api"

const STORAGE_KEY = "masjid-treasury-demo-v3"
type TreasuryContextValue = {
  causes: Cause[]; donations: Donation[]
  createDonation: (data: DonationCreate) => void
  reclassifyDonation: (id: string, donationType: DonationType) => void
  importCannedStatement: () => ImportResult
}
type TreasuryData = Pick<TreasuryContextValue, "causes" | "donations">
const TreasuryContext = createContext<TreasuryContextValue | null>(null)
const cloneSeed = () => ({ causes: structuredClone(DEMO_CAUSES), donations: structuredClone(DEMO_DONATIONS) })
const id = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`

export function TreasuryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(cloneSeed)
  const dataRef = useRef<TreasuryData>(data)

  const commit = useCallback((change: (current: TreasuryData) => TreasuryData) => {
    const next = change(dataRef.current)
    dataRef.current = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setData(next)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TreasuryData
        dataRef.current = parsed
        setData(parsed)
      } catch { localStorage.removeItem(STORAGE_KEY) }
    }
  }, [])
  useEffect(() => {
    const syncFromAnotherTab = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        const parsed = JSON.parse(event.newValue) as TreasuryData
        dataRef.current = parsed
        setData(parsed)
      } catch { /* Ignore malformed browser storage. */ }
    }
    window.addEventListener("storage", syncFromAnotherTab)
    return () => window.removeEventListener("storage", syncFromAnotherTab)
  }, [])
  const value = useMemo<TreasuryContextValue>(() => ({
    ...data,
    createDonation: (input) => commit((current) => {
      const next = { ...current, donations: [{ id: id(), amountPence: input.amountPence, donationType: input.donationType, causeId: input.causeId ?? null, giftAid: input.giftAid ?? false, donorRef: input.donorRef ?? null, source: input.source ?? "manual", createdAt: new Date().toISOString() }, ...current.donations] }
      return next
    }),
    reclassifyDonation: (donationId, donationType) => commit((current) => {
      const next = { ...current, donations: current.donations.map((donation) => donation.id === donationId ? { ...donation, donationType } : donation) }
      return next
    }),
    importCannedStatement: () => {
      const rows: Array<[number, number, DonationType, string | null]> = [[2, 10_000, "zakat", "Monthly zakat payment"], [3, 5_000, "sadaqah", "Sadaqah for Ramadan"], [4, 7_500, "uncategorised", "Ramadan donation"], [5, 20_000, "uncategorised", "Anonymous transfer"], [6, 2_000, "zakat_al_fitr", "Fitrana - family of 4"], [7, 30_000, "general", "Roof appeal donation"]]
      const records = rows.map(([row, amountPence, donationType, donorRef]) => ({ row, donationId: id(), amountPence, donationType, donorRef }))
      commit((current) => {
        const next = { ...current, donations: [...records.map((record) => ({ id: record.donationId, amountPence: record.amountPence, donationType: record.donationType, causeId: null, giftAid: false, donorRef: record.donorRef, source: "bulk_import" as const, createdAt: new Date().toISOString() })), ...current.donations] }
        return next
      })
      const classified = records.filter((record) => record.donationType !== "uncategorised")
      const uncategorised = records.filter((record) => record.donationType === "uncategorised")
      return { classified, uncategorised, errors: [], summary: { classifiedCount: classified.length, uncategorisedCount: uncategorised.length, errorCount: 0 } }
    },
  }), [commit, data])
  return <TreasuryContext.Provider value={value}>{children}</TreasuryContext.Provider>
}

export function useTreasury() {
  const context = useContext(TreasuryContext)
  if (!context) throw new Error("useTreasury must be used inside TreasuryProvider")
  return context
}
