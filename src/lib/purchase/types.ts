export type PurchaseLine = {
  id: string
  barcode: string
  productName: string
  unitPrice: number
  qty: number
  expiry: string
}

export type PurchaseIncomingStatus = "Received" | "Pending" | "Cancelled"

export type IncomingGoodsRecord = {
  id: string
  invoiceNo: string
  supplier: string
  purchasedAt: string
  status: PurchaseIncomingStatus
  lines: PurchaseLine[]
  grandTotal: number
}

export type PurchaseTrendPoint = {
  month: string
  amount: number
}

export type SupplierSpend = {
  supplier: string
  amount: number
}

export const PURCHASE_REPORT_PAGE_SIZE = 8

export function incomingRecordsToReportRows(
  records: IncomingGoodsRecord[]
): IncomingGoodsRecord[] {
  return [...records].sort(
    (a, b) =>
      new Date(b.purchasedAt.replace(/\//g, "-")).getTime() -
      new Date(a.purchasedAt.replace(/\//g, "-")).getTime()
  )
}

export function filterIncomingRecords(
  records: IncomingGoodsRecord[],
  status: string,
  search: string
): IncomingGoodsRecord[] {
  const q = search.trim().toLowerCase()
  return records.filter((r) => {
    if (status !== "Semua" && r.status !== status) return false
    if (!q) return true
    return (
      r.invoiceNo.toLowerCase().includes(q) ||
      r.supplier.toLowerCase().includes(q)
    )
  })
}

export function filterReportRecords(
  records: IncomingGoodsRecord[],
  search: string,
  period: string
): IncomingGoodsRecord[] {
  const q = search.trim().toLowerCase()
  const now = new Date()
  let list = records

  if (period === "Bulan ini") {
    const prefix = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`
    list = list.filter((r) => r.purchasedAt.startsWith(prefix))
  } else if (period === "Tahun ini") {
    list = list.filter((r) => r.purchasedAt.startsWith(String(now.getFullYear())))
  }

  if (!q) return list
  return list.filter(
    (r) =>
      r.invoiceNo.toLowerCase().includes(q) ||
      r.supplier.toLowerCase().includes(q)
  )
}

export function totalUnitsInRecords(records: IncomingGoodsRecord[]): number {
  return records.reduce(
    (s, r) => s + r.lines.reduce((ls, l) => ls + l.qty, 0),
    0
  )
}
