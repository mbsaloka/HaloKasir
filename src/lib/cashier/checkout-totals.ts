export type CheckoutTotals = {
  subtotal: number
  discount: number
  tax: number
  total: number
}

export function clampCheckoutDiscount(subtotal: number, discount: number) {
  const safeSubtotal = Math.max(0, Math.trunc(subtotal))
  const safeDiscount = Math.max(0, Math.trunc(discount))

  return Math.min(safeDiscount, safeSubtotal)
}

export function calculateCheckoutTotals(
  subtotal: number,
  discount = 0
): CheckoutTotals {
  const safeSubtotal = Math.max(0, Math.trunc(subtotal))
  const safeDiscount = clampCheckoutDiscount(safeSubtotal, discount)
  const taxableBase = safeSubtotal - safeDiscount
  const tax = Math.round(taxableBase * 0.11)

  return {
    subtotal: safeSubtotal,
    discount: safeDiscount,
    tax,
    total: taxableBase + tax,
  }
}
