import { desc } from "drizzle-orm"

import { db, assertDatabaseConfigured } from "@/db"
import { purchaseLines, purchaseRecords, suppliers } from "@/db/schema"
import { formatDisplayDateTime, monthLabel } from "@/lib/data/format"
import type {
  IncomingGoodsRecord,
  PurchaseIncomingStatus,
  PurchaseTrendPoint,
  SupplierSpend,
} from "@/lib/purchase/types"

export type PurchaseReportData = {
  records: IncomingGoodsRecord[]
  trend: PurchaseTrendPoint[]
  supplierSpend: SupplierSpend[]
}

function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function mapStatus(value: string): PurchaseIncomingStatus {
  if (value === "Pending" || value === "Cancelled") return value
  return "Received"
}

export async function getSuppliers(): Promise<string[]> {
  assertDatabaseConfigured()

  const rows = await db.select().from(suppliers).orderBy(suppliers.name)
  return rows.map((row) => row.name)
}

export async function getPurchaseRecords(): Promise<IncomingGoodsRecord[]> {
  assertDatabaseConfigured()

  const [records, lines] = await Promise.all([
    db
      .select()
      .from(purchaseRecords)
      .orderBy(desc(purchaseRecords.purchasedAt)),
    db.select().from(purchaseLines),
  ])

  const linesByPurchase = new Map<string, typeof lines>()
  for (const line of lines) {
    const list = linesByPurchase.get(line.purchaseId) ?? []
    list.push(line)
    linesByPurchase.set(line.purchaseId, list)
  }

  return records.map((record) => ({
    id: record.id,
    invoiceNo: record.invoiceNo,
    supplier: record.supplierName,
    purchasedAt: formatDisplayDateTime(record.purchasedAt),
    status: mapStatus(record.status),
    lines: (linesByPurchase.get(record.id) ?? []).map((line) => ({
      id: line.id,
      barcode: line.barcode,
      productName: line.productName,
      unitPrice: line.unitPrice,
      qty: line.qty,
      expiry: line.expiry,
    })),
    grandTotal: record.grandTotal,
  }))
}

export async function getPurchaseReportData(): Promise<PurchaseReportData> {
  assertDatabaseConfigured()

  const records = await getPurchaseRecords()
  const rawRecords = await db.select().from(purchaseRecords)
  const now = new Date()
  const currentMonth = startOfMonth(now)

  const trend = Array.from({ length: 6 }, (_, index) => {
    const month = addMonths(currentMonth, index - 5)
    return {
      month: monthLabel(month),
      amount: rawRecords
        .filter((record) => sameMonth(record.purchasedAt, month))
        .reduce((sum, record) => sum + record.grandTotal, 0),
    }
  })

  const spendBySupplier = new Map<string, number>()
  for (const record of rawRecords) {
    spendBySupplier.set(
      record.supplierName,
      (spendBySupplier.get(record.supplierName) ?? 0) + record.grandTotal
    )
  }

  const supplierSpend: SupplierSpend[] = Array.from(spendBySupplier.entries())
    .map(([supplier, amount]) => ({ supplier, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)

  return {
    records,
    trend,
    supplierSpend,
  }
}
