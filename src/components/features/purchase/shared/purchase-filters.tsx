"use client"

import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PurchaseFiltersProps = {
  search: string
  onSearchChange: (v: string) => void
  statusFilter?: {
    value: string
    onChange: (v: string) => void
  }
  periodFilter?: {
    value: string
    onChange: (v: string) => void
  }
  className?: string
}

const STATUS_OPTIONS = ["Semua", "Received", "Pending", "Cancelled"] as const
const PERIOD_OPTIONS = ["Semua", "Bulan ini", "Tahun ini"] as const

export function PurchaseFilters({
  search,
  onSearchChange,
  statusFilter,
  periodFilter,
  className,
}: PurchaseFiltersProps) {
  return (
    <div
      className={`flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center ${className ?? ""}`}
    >
      <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari"
          className="bg-background border-border h-9 pl-9 shadow-xs"
          aria-label="Cari"
        />
      </div>

      {statusFilter ? (
        <Select value={statusFilter.value} onValueChange={statusFilter.onChange}>
          <SelectTrigger className="bg-background h-9 w-full border-border shadow-xs sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {periodFilter ? (
        <Select value={periodFilter.value} onValueChange={periodFilter.onChange}>
          <SelectTrigger className="bg-background h-9 w-full border-border shadow-xs sm:w-[160px]">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  )
}
