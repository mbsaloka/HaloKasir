export type OverviewMetric = {
  id: string
  label: string
  value: number
}

export type BestSellingCategory = {
  category: string
  turnOver: number
  increasePercent: number
}

export type ProfitRevenuePoint = {
  month: string
  revenue: number
  profit: number
}

export type BestSellingProduct = {
  product: string
  productId: string
  category: string
  remainingQty: string
  turnOver: number
  increasePercent: number
}

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

export const TRANSACTION_PAGE_SIZE = 10
