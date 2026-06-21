import type { Cause, Donation } from "@/lib/api"

export const DEMO_CAUSES: Cause[] = [
  {
    id: "roof-repair",
    name: "Roof Repair",
    targetPence: 1_000_000,
    deadline: null,
    allowedTypes: [],
    createdAt: "2026-06-20T18:16:09.930Z",
    description:
      "Help us repair the masjid roof, protect the prayer hall, and keep the building safe for worshippers.",
    story:
      "Recent inspections found water ingress above the main prayer area. The repair work includes fixing damaged roof sections, improving waterproofing, and making good internal areas affected by leaks.",
    impact:
      "Your donation helps keep daily prayers, Qur’an classes, Jumu’ah, and community gatherings running safely without disruption.",
    images: [
      {
        id: "roof-before",
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        alt: "Builders working on a roof",
        caption: "Roof repair works in progress",
      },
    ],
  },
  {
    id: "ramadan-iftar",
    name: "Ramadan Iftar",
    targetPence: 500_000,
    deadline: null,
    allowedTypes: ["sadaqah", "general"],
    createdAt: "2026-06-20T18:16:09.944Z",
    description:
      "Sponsor community iftars and help us feed fasting people during Ramadan.",
    story:
      "Every Ramadan, the masjid welcomes students, families, elders, travellers, and people who may otherwise break their fast alone.",
    impact:
      "Your donation funds meals, dates, water, setup, cleaning, and volunteer support for community iftars.",
    images: [],
  },
  {
    id: "hardship-fund",
    name: "Hardship Fund",
    targetPence: 750_000,
    deadline: null,
    allowedTypes: [],
    createdAt: "2026-06-20T18:16:09.953Z",
    description:
      "Support local families facing urgent financial hardship.",
    story:
      "The hardship fund helps with essentials such as food, rent shortfalls, emergency travel, utility bills, and other urgent needs verified by the masjid team.",
    impact:
      "Your donation lets the masjid respond quickly and discreetly when community members need support.",
    images: [],
  },
]

export const DEMO_DONATIONS: Donation[] = [
  ["hardship-lillah", 75_000, "lillah", "hardship-fund", null], ["hardship-sadaqah", 130_000, "sadaqah", "hardship-fund", null], ["hardship-general", 310_000, "general", "hardship-fund", null],
  ["iftar-sadaqah", 85_000, "sadaqah", "ramadan-iftar", null], ["iftar-general", 195_000, "general", "ramadan-iftar", null], ["roof-sadaqah", 115_000, "sadaqah", "roof-repair", null], ["roof-general", 320_000, "general", "roof-repair", null],
  ["ramadan-unclassified", 7_500, "uncategorised", null, "Ramadan donation"], ["fitrana-demo", 1_000, "zakat_al_fitr", null, "Demo zakat al-fitr"], ["sadaqah-demo", 2_000, "sadaqah", "ramadan-iftar", "Demo sadaqah"], ["zakat-demo", 10_000, "zakat", null, "Demo zakat"],
].map(([id, amountPence, donationType, causeId, donorRef], index) => ({
  id: id as string, amountPence: amountPence as number, donationType: donationType as Donation["donationType"], causeId: causeId as string | null, donorRef: donorRef as string | null,
  giftAid: false, source: id === "ramadan-unclassified" ? "bulk_import" : "manual", createdAt: new Date(Date.UTC(2026, 5, 20, 18, 16, 10 - index)).toISOString(),
}))
