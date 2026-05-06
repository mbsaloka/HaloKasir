"use client"

import { DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateFilter } from "@/components/features/sales/date-filter"

export type QuickRange = "all" | "today" | "week" | "year"

export type TransactionFiltersProps = {
  quickRange: QuickRange
  onQuickRangeChange: (v: QuickRange) => void
  statusFilter: string
  onStatusFilterChange: (v: string) => void
}

const QUICK: { id: QuickRange; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "today", label: "Hari Ini" },
  { id: "week", label: "Minggu Ini" },
  { id: "year", label: "Tahun Ini" },
]

export function TransactionFilters({
  quickRange,
  onQuickRangeChange,
  statusFilter,
  onStatusFilterChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={quickRange}
        onValueChange={(v) => onQuickRangeChange(v as QuickRange)}
        className="w-full max-w-full gap-3"
      >
        <TabsList className="bg-muted/80 border-border h-auto w-full flex-wrap justify-start gap-1 rounded-lg border p-1 md:inline-flex md:w-auto">
          {QUICK.map((q) => (
            <TabsTrigger
              key={q.id}
              value={q.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0 px-3 py-1.5 text-xs shadow-none sm:text-sm"
            >
              {q.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <DateFilter />
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="bg-background h-9 w-full border-border shadow-xs sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
              <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-border h-9 shrink-0 shadow-xs"
          onClick={() => {
            /* mock unduh */
          }}
        >
          <DownloadIcon className="size-4" />
          Unduh Data
        </Button>
      </div>
    </div>
  )
}
