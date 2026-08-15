import type { DonationType } from "./api"

export interface FundConfig {
  label: string
  description: string
  color: string    // text / border accent
  bg: string       // tinted background (light contexts)
  chartColor: string // accessible segment colour for charts
  restricted: boolean
}

export const FUND_CONFIG: Record<DonationType, FundConfig> = {
  zakat: {
    label: "Zakat",
    description: "Obligatory almsgiving (2.5% of savings)",
    color: "#854D0E",
    bg: "#FEF9C3",
    chartColor: "#CA8A04",
    restricted: true,
  },
  sadaqah: {
    label: "Sadaqah",
    description: "Voluntary charity",
    color: "#166534",
    bg: "#DCFCE7",
    chartColor: "#16A34A",
    restricted: false,
  },
  lillah: {
    label: "Lillah",
    description: "For the sake of Allah",
    color: "#4338CA",
    bg: "#E0E7FF",
    chartColor: "#6366F1",
    restricted: false,
  },
  zakat_al_fitr: {
    label: "Zakat al-Fitr",
    description: "Obligatory end-of-Ramadan charity (fitrana)",
    color: "#9A3412",
    bg: "#FFEDD5",
    chartColor: "#EA580C",
    restricted: true,
  },
  fidya: {
    label: "Fidya",
    description: "Compensation for missed fasts",
    color: "#9D174D",
    bg: "#FCE7F3",
    chartColor: "#DB2777",
    restricted: true,
  },
  kaffarah: {
    label: "Kaffarah",
    description: "Expiation for broken oaths or fasts",
    color: "#86198F",
    bg: "#FAE8FF",
    chartColor: "#C026D3",
    restricted: true,
  },
  waqf: {
    label: "Waqf",
    description: "Islamic endowment (perpetual)",
    color: "#5B21B6",
    bg: "#EDE9FE",
    chartColor: "#7C3AED",
    restricted: true,
  },
  general: {
    label: "General",
    description: "General donation",
    color: "#475569",
    bg: "#F1F5F9",
    chartColor: "#64748B",
    restricted: false,
  },
  uncategorised: {
    label: "Uncategorised",
    description: "Awaiting classification by treasurer",
    color: "#92400E",
    bg: "#FEF3C7",
    chartColor: "#D97706",
    restricted: false,
  },
}

export const ALL_TYPES = Object.keys(FUND_CONFIG) as DonationType[]

export const CLASSIFIABLE_TYPES = ALL_TYPES.filter((t) => t !== "uncategorised")
