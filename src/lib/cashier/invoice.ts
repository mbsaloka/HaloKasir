export function makeCashierInvoiceNo(date = new Date()) {
  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")

  return `KSR${yy}${mm}${dd}${String(date.getTime()).slice(-6)}`
}
