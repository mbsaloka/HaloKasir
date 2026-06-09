import type { Metadata } from "next"

import { TransactionHistoryClient } from "@/components/features/sales/transactions/transaction-history-client"
import { getSalesTransactions } from "@/lib/data/sales"

export const metadata: Metadata = {
  title: "Riwayat Transaksi",
}

export default async function SalesTransactionsPage() {
  const transactions = await getSalesTransactions()

  return (
    <div className="mx-auto max-w-7xl">
      <TransactionHistoryClient transactions={transactions} />
    </div>
  )
}
