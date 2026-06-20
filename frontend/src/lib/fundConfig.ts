import type { DonationType } from "./api"

export interface FundConfig {
  label: string
  description: string
  color: string    // text / border accent
  bg: string       // light tinted background
  restricted: boolean
}

export const FUND_CONFIG: Record<DonationType, FundConfig> = {
  zakat: {
    label: "Zakat",
    description: "Obligatory almsgiving (2.5% of savings)",
    color: "#92400E",
    bg: "#FFFBEB",
    restricted: true,
  },
  sadaqah: {
    label: "Sadaqah",
    description: "Voluntary charity",
    color: "#166534",
    bg: "#F0FDF4",
    restricted: false,
  },
  lillah: {
    label: "Lillah",
    description: "For the sake of Allah",
    color: "#3730A3",
    bg: "#EEF2FF",
    restricted: false,
  },
  zakat_al_fitr: {
    label: "Zakat al-Fitr",
    description: "Obligatory end-of-Ramadan charity (fitrana)",
    color: "#9A3412",
    bg: "#FFF7ED",
    restricted: true,
  },
  fidya: {
    label: "Fidya",
    description: "Compensation for missed fasts",
    color: "#9D174D",
    bg: "#FDF2F8",
    restricted: true,
  },
  kaffarah: {
    label: "Kaffarah",
    description: "Expiation for broken oaths or fasts",
    color: "#9D174D",
    bg: "#FDF2F8",
    restricted: true,
  },
  waqf: {
    label: "Waqf",
    description: "Islamic endowment (perpetual)",
    color: "#5B21B6",
    bg: "#F5F3FF",
    restricted: true,
  },
  general: {
    label: "General",
    description: "General donation",
    color: "#334155",
    bg: "#F8FAFC",
    restricted: false,
  },
  uncategorised: {
    label: "Uncategorised",
    description: "Awaiting classification by treasurer",
    color: "#92400E",
    bg: "#FEFCE8",
    restricted: false,
  },
}

export const ALL_TYPES = Object.keys(FUND_CONFIG) as DonationType[]

export const CLASSIFIABLE_TYPES = ALL_TYPES.filter((t) => t !== "uncategorised")
