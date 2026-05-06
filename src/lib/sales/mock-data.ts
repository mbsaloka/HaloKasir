/** Mock data & types for modul Penjualan — tanpa backend */

export type OverviewMetric = {
  id: string
  label: string
  value: number
}

export const MOCK_OVERVIEW_METRICS: OverviewMetric[] = [
  { id: "profit", label: "Total Profit", value: 21_190 },
  { id: "revenue", label: "Revenue", value: 18_300 },
  { id: "sales", label: "Sales", value: 17_432 },
  { id: "net-purchase", label: "Net purchase value", value: 117_432 },
  { id: "net-sales", label: "Net sales value", value: 80_432 },
  { id: "mom", label: "MOM Profit", value: 30_432 },
  { id: "yoy", label: "YoY Profit", value: 110_432 },
]

export type BestSellingCategory = {
  category: string
  turnOver: number
  increasePercent: number
}

export const MOCK_BEST_CATEGORIES: BestSellingCategory[] = [
  { category: "Vegetable", turnOver: 26_000, increasePercent: 3.2 },
  { category: "Instant Food", turnOver: 22_000, increasePercent: 2.0 },
  { category: "Households", turnOver: 22_000, increasePercent: 1.5 },
]

export type ProfitRevenuePoint = {
  month: string
  revenue: number
  profit: number
}

/** Sep–Mar sesuai sumbu X di Figma */
export const MOCK_PROFIT_REVENUE_SERIES: ProfitRevenuePoint[] = [
  { month: "Sep", revenue: 42_000, profit: 28_000 },
  { month: "Oct", revenue: 55_000, profit: 32_000 },
  { month: "Nov", revenue: 48_000, profit: 30_000 },
  { month: "Dec", revenue: 62_000, profit: 38_000 },
  { month: "Jan", revenue: 58_000, profit: 35_000 },
  { month: "Feb", revenue: 71_000, profit: 44_000 },
  { month: "Mar", revenue: 68_000, profit: 41_000 },
]

export type BestSellingProduct = {
  product: string
  productId: string
  category: string
  remainingQty: string
  turnOver: number
  increasePercent: number
}

export const MOCK_BEST_PRODUCTS: BestSellingProduct[] = [
  {
    product: "Tomato",
    productId: "23587",
    category: "Vegetable",
    remainingQty: "225 kg",
    turnOver: 17_000,
    increasePercent: 2.5,
  },
  {
    product: "Durian",
    productId: "21831",
    category: "Vegetable",
    remainingQty: "200 kg",
    turnOver: 12_300,
    increasePercent: 1.3,
  },
  {
    product: "Indomie Goreng",
    productId: "44102",
    category: "Instant Food",
    remainingQty: "480 pcs",
    turnOver: 9_800,
    increasePercent: 4.1,
  },
  {
    product: "Sabun Cair 1L",
    productId: "88291",
    category: "Households",
    remainingQty: "120 botol",
    turnOver: 8_450,
    increasePercent: 0.9,
  },
]

export type TransactionPaymentMethod = "Tunai" | "Kartu" | "QRIS"

export type TransactionStatus = "Selesai" | "Dibatalkan"

export type SalesTransaction = {
  id: string
  transactionAt: string
  customerId: string
  cashier: string
  paymentMethod: TransactionPaymentMethod
  subtotal: number
  status: TransactionStatus
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function formatTransactionTs(d: Date): string {
  return `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

function buildMockTransactions(count: number): SalesTransaction[] {
  const methods: TransactionPaymentMethod[] = ["Tunai", "Kartu", "QRIS"]
  const statuses: TransactionStatus[] = ["Selesai", "Selesai", "Selesai", "Dibatalkan"]
  const anchor = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(anchor)
    d.setDate(d.getDate() - (i % 52))
    d.setMinutes(d.getMinutes() - i)
    return {
      id: `${63245646454 + i}`,
      transactionAt: formatTransactionTs(d),
      customerId: "10148438215",
      cashier: i % 5 === 0 ? "Christoforus" : i % 5 === 1 ? "Andi" : "Sari",
      paymentMethod: methods[i % methods.length],
      subtotal: 300_000 + (i % 7) * 12_500,
      status: statuses[i % statuses.length],
    }
  })
}

/** Riwayat transaksi — cukup banyak untuk pagination mock */
export const MOCK_SALES_TRANSACTIONS: SalesTransaction[] = buildMockTransactions(48)

export const MOCK_TRANSACTION_PAGE_SIZE = 10
