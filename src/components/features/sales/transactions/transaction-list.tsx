"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TransactionTable } from "@/components/features/sales/transaction-table"
import type { SalesTransaction } from "@/lib/sales/mock-data"

type TransactionListProps = {
  rows: SalesTransaction[]
  page: number
  pageSize: number
  totalFiltered: number
  onPageChange: (page: number) => void
}

export function TransactionList({
  rows,
  page,
  pageSize,
  totalFiltered,
  onPageChange,
}: TransactionListProps) {
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const start = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalFiltered)

  return (
    <div className="space-y-4">
      <div className="border-border rounded-xl border bg-card shadow-xs">
        <TransactionTable rows={rows} />
      </div>

      <div className="text-muted-foreground flex flex-col items-stretch justify-between gap-3 text-sm sm:flex-row sm:items-center">
        <p className="tabular-nums">
          {start}–{end} dari {totalFiltered.toLocaleString("id-ID")}
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeftIcon className="size-4" />
            Sebelumnya
          </Button>
          <span className="text-foreground px-2 tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Berikutnya
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
