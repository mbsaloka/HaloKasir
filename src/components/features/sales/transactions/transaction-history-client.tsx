"use client"

import { useEffect, useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  TransactionFilters,
  type QuickRange,
} from "@/components/features/sales/transactions/transaction-filters"
import { TransactionList } from "@/components/features/sales/transactions/transaction-list"
import {
  MOCK_SALES_TRANSACTIONS,
  MOCK_TRANSACTION_PAGE_SIZE,
  type SalesTransaction,
} from "@/lib/sales/mock-data"
import { parseTransactionAtDisplay } from "@/lib/sales/parse-transaction-date"

function matchesQuickRange(d: Date, range: QuickRange, now: Date): boolean {
  if (range === "all") return true
  if (range === "today") {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  }
  if (range === "week") {
    const day = (now.getDay() + 6) % 7
    const start = new Date(now)
    start.setDate(now.getDate() - day)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return d >= start && d <= end
  }
  if (range === "year") {
    return d.getFullYear() === now.getFullYear()
  }
  return true
}

function filterRows(
  data: SalesTransaction[],
  query: string,
  quickRange: QuickRange,
  statusFilter: string
): SalesTransaction[] {
  const now = new Date()
  const q = query.trim().toLowerCase()
  return data.filter((row) => {
    if (statusFilter !== "all" && row.status !== statusFilter) return false
    const d = parseTransactionAtDisplay(row.transactionAt)
    if (!matchesQuickRange(d, quickRange, now)) return false
    if (!q) return true
    return (
      row.id.toLowerCase().includes(q) ||
      row.customerId.toLowerCase().includes(q) ||
      row.cashier.toLowerCase().includes(q) ||
      row.paymentMethod.toLowerCase().includes(q)
    )
  })
}

export function TransactionHistoryClient() {
  const [search, setSearch] = useState("")
  const [quickRange, setQuickRange] = useState<QuickRange>("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () =>
      filterRows(MOCK_SALES_TRANSACTIONS, search, quickRange, statusFilter),
    [search, quickRange, statusFilter]
  )

  const pageSize = MOCK_TRANSACTION_PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const safePage = Math.min(page, totalPages)
  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage, pageSize])

  function handleFilterChange() {
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
          Riwayat Transaksi
        </h1>
        <div className="relative w-full max-w-md sm:max-w-xs md:max-w-sm">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Cari"
            className="bg-background border-border h-9 pl-9 shadow-xs"
            aria-label="Cari transaksi"
          />
        </div>
      </div>

      <TransactionFilters
        quickRange={quickRange}
        onQuickRangeChange={(v) => {
          setQuickRange(v)
          handleFilterChange()
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => {
          setStatusFilter(v)
          handleFilterChange()
        }}
      />

      <TransactionList
        rows={pageSlice}
        page={safePage}
        pageSize={pageSize}
        totalFiltered={filtered.length}
        onPageChange={setPage}
      />
    </div>
  )
}
