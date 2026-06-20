const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
})

/** The only place in the codebase that converts integer pence to a display string. */
export function formatPence(pence: number): string {
  return GBP.format(pence / 100)
}
