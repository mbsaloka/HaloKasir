import { desc } from "drizzle-orm"

import { db, assertDatabaseConfigured } from "@/db"
import {
  products,
  salesTransactionItems,
  salesTransactions,
} from "@/db/schema"
import { formatDisplayDateTime, monthLabel } from "@/lib/data/format"
import type {
  BestSellingCategory,
  BestSellingProduct,
  OverviewMetric,
  ProfitRevenuePoint,
  SalesTransaction,
  TransactionPaymentMethod,
  TransactionStatus,
} from "@/lib/sales/types"

export type SalesReportData = {
  metrics: OverviewMetric[]
  bestCategories: BestSellingCategory[]
  bestProducts: BestSellingProduct[]
  series: ProfitRevenuePoint[]
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function percentChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

function mapPaymentMethod(value: string): TransactionPaymentMethod {
  if (value === "Kartu" || value === "QRIS" || value === "Tunai") return value
  return "Tunai"
}

function mapStatus(value: string): TransactionStatus {
  return value === "Dibatalkan" ? "Dibatalkan" : "Selesai"
}

export async function getSalesTransactions(): Promise<SalesTransaction[]> {
  assertDatabaseConfigured()

  const rows = await db
    .select()
    .from(salesTransactions)
    .orderBy(desc(salesTransactions.transactionAt))

  return rows.map((row) => ({
    id: row.id,
    transactionAt: formatDisplayDateTime(row.transactionAt),
    customerId: row.customerId,
    cashier: row.cashierName,
    paymentMethod: mapPaymentMethod(row.paymentMethod),
    subtotal: row.total,
    status: mapStatus(row.status),
  }))
}

export async function getSalesReportData(): Promise<SalesReportData> {
  assertDatabaseConfigured()

  const [txRows, itemRows, productRows] = await Promise.all([
    db.select().from(salesTransactions),
    db.select().from(salesTransactionItems),
    db.select().from(products),
  ])

  const transactionsById = new Map(txRows.map((tx) => [tx.id, tx]))
  const completed = txRows.filter((tx) => tx.status === "Selesai")
  const completedIds = new Set(completed.map((tx) => tx.id))
  const completedItems = itemRows.filter((item) =>
    completedIds.has(item.transactionId)
  )

  const revenue = completed.reduce((sum, tx) => sum + tx.total, 0)
  const profit = completedItems.reduce((sum, item) => sum + item.lineProfit, 0)
  const unitsSold = completedItems.reduce((sum, item) => sum + item.quantity, 0)

  const now = new Date()
  const currentMonth = startOfMonth(now)
  const previousMonth = addMonths(currentMonth, -1)

  const currentMonthProfit = completedItems.reduce((sum, item) => {
    const tx = transactionsById.get(item.transactionId)
    return tx && sameMonth(tx.transactionAt, currentMonth)
      ? sum + item.lineProfit
      : sum
  }, 0)
  const previousMonthProfit = completedItems.reduce((sum, item) => {
    const tx = transactionsById.get(item.transactionId)
    return tx && sameMonth(tx.transactionAt, previousMonth)
      ? sum + item.lineProfit
      : sum
  }, 0)
  const yearProfit = completedItems.reduce((sum, item) => {
    const tx = transactionsById.get(item.transactionId)
    return tx && tx.transactionAt.getFullYear() === now.getFullYear()
      ? sum + item.lineProfit
      : sum
  }, 0)
  const previousYearProfit = completedItems.reduce((sum, item) => {
    const tx = transactionsById.get(item.transactionId)
    return tx && tx.transactionAt.getFullYear() === now.getFullYear() - 1
      ? sum + item.lineProfit
      : sum
  }, 0)

  const totalPurchaseValue = completedItems.reduce(
    (sum, item) => sum + item.unitCost * item.quantity,
    0
  )

  const metrics: OverviewMetric[] = [
    { id: "profit", label: "Total Profit", value: profit },
    { id: "revenue", label: "Revenue", value: revenue },
    { id: "sales", label: "Sales", value: unitsSold },
    { id: "net-purchase", label: "Net purchase value", value: totalPurchaseValue },
    { id: "net-sales", label: "Net sales value", value: revenue },
    {
      id: "mom",
      label: "MOM Profit",
      value: Math.round(percentChange(currentMonthProfit, previousMonthProfit)),
    },
    {
      id: "yoy",
      label: "YoY Profit",
      value: Math.round(percentChange(yearProfit, previousYearProfit)),
    },
  ]

  const categoryTotals = new Map<
    string,
    { current: number; previous: number; total: number }
  >()
  const productTotals = new Map<
    string,
    {
      product: string
      productId: string
      category: string
      current: number
      previous: number
      total: number
    }
  >()

  for (const item of completedItems) {
    const tx = transactionsById.get(item.transactionId)
    if (!tx) continue

    const category = categoryTotals.get(item.category) ?? {
      current: 0,
      previous: 0,
      total: 0,
    }
    category.total += item.lineTotal
    if (sameMonth(tx.transactionAt, currentMonth)) category.current += item.lineTotal
    if (sameMonth(tx.transactionAt, previousMonth)) category.previous += item.lineTotal
    categoryTotals.set(item.category, category)

    const key = item.productId ?? item.sku
    const product = productTotals.get(key) ?? {
      product: item.productName,
      productId: item.sku,
      category: item.category,
      current: 0,
      previous: 0,
      total: 0,
    }
    product.total += item.lineTotal
    if (sameMonth(tx.transactionAt, currentMonth)) product.current += item.lineTotal
    if (sameMonth(tx.transactionAt, previousMonth)) product.previous += item.lineTotal
    productTotals.set(key, product)
  }

  const bestCategories = Array.from(categoryTotals.entries())
    .map(([category, value]) => ({
      category,
      turnOver: value.total,
      increasePercent: percentChange(value.current, value.previous),
    }))
    .sort((a, b) => b.turnOver - a.turnOver)
    .slice(0, 3)

  const productStockBySku = new Map(
    productRows.map((product) => [product.sku, product.stock])
  )
  const bestProducts = Array.from(productTotals.values())
    .map((value) => ({
      product: value.product,
      productId: value.productId,
      category: value.category,
      remainingQty: `${productStockBySku.get(value.productId) ?? 0} pcs`,
      turnOver: value.total,
      increasePercent: percentChange(value.current, value.previous),
    }))
    .sort((a, b) => b.turnOver - a.turnOver)
    .slice(0, 8)

  const series = Array.from({ length: 7 }, (_, index) => {
    const month = addMonths(currentMonth, index - 6)
    const monthItems = completedItems.filter((item) => {
      const tx = transactionsById.get(item.transactionId)
      return tx ? sameMonth(tx.transactionAt, month) : false
    })

    return {
      month: monthLabel(month),
      revenue: monthItems.reduce((sum, item) => sum + item.lineTotal, 0),
      profit: monthItems.reduce((sum, item) => sum + item.lineProfit, 0),
    }
  })

  return {
    metrics,
    bestCategories,
    bestProducts,
    series,
  }
}
