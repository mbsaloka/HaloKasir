"use client"

import { DownloadIcon, ListIcon, PlusIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PurchaseFilters } from "@/components/features/purchase/shared/purchase-filters"

type ReportToolbarProps = {
  search: string
  onSearchChange: (v: string) => void
  period: string
  onPeriodChange: (v: string) => void
}

export function ReportToolbar({
  search,
  onSearchChange,
  period,
  onPeriodChange,
}: ReportToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-base font-semibold tracking-tight">
        Riwayat Pembelian
      </h2>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border h-9 shadow-xs"
            onClick={() => {

            }}
          >
            <ListIcon className="size-4" />
            Kolom
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <PurchaseFilters
            search={search}
            onSearchChange={onSearchChange}
            periodFilter={{ value: period, onChange: onPeriodChange }}
            className="flex-1 sm:justify-end"
          />
          <Button type="button" size="sm" className="h-9 gap-1 shadow-xs" asChild>
            <Link href="/purchase/incoming">
              <PlusIcon className="size-4" />
              Tambah Stok
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border h-9 shadow-xs"
            onClick={() => {

            }}
          >
            <DownloadIcon className="size-4" />
            Unduh Data
          </Button>
        </div>
      </div>
    </div>
  )
}
