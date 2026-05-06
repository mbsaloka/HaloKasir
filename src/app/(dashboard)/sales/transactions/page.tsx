import type { Metadata } from "next"

import { TransactionHistoryClient } from "@/components/features/sales/transactions/transaction-history-client"

export const metadata: Metadata = {
  title: "Riwayat Transaksi",
}

export default function SalesTransactionsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <TransactionHistoryClient />
    </div>
  )
}
