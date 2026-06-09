"use client"

import { useMemo, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PurchaseDetailDialog } from "@/components/features/purchase/shared/purchase-detail-dialog"
import { PurchaseChartsDynamic } from "@/components/features/purchase/report/purchase-charts-dynamic"
import { PurchaseReportTable } from "@/components/features/purchase/report/purchase-report-table"
import { PurchaseSummaryCards } from "@/components/features/purchase/report/purchase-summary-cards"
import { ReportToolbar } from "@/components/features/purchase/report/report-toolbar"
import {
  PURCHASE_REPORT_PAGE_SIZE,
  filterReportRecords,
  incomingRecordsToReportRows,
  type IncomingGoodsRecord,
} from "@/lib/purchase/types"
import type { PurchaseReportData } from "@/lib/data/purchase"

type ReportPageClientProps = {
  report: PurchaseReportData
}

export function ReportPageClient({ report }: ReportPageClientProps) {
  const [search, setSearch] = useState("")
  const [period, setPeriod] = useState("Semua")
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<IncomingGoodsRecord | null>(null)

  const sorted = useMemo(
    () => incomingRecordsToReportRows(report.records),
    [report.records]
  )

  const filtered = useMemo(
    () => filterReportRecords(sorted, search, period),
    [sorted, search, period]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PURCHASE_REPORT_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const slice = useMemo(() => {
    const start = (safePage - 1) * PURCHASE_REPORT_PAGE_SIZE
    return filtered.slice(start, start + PURCHASE_REPORT_PAGE_SIZE)
  }, [filtered, safePage])

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PurchaseSummaryCards records={sorted} />

      <PurchaseChartsDynamic
        trend={report.trend}
        supplierSpend={report.supplierSpend}
      />

      <div className="space-y-4">
        <ReportToolbar
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          period={period}
          onPeriodChange={(value) => {
            setPeriod(value)
            setPage(1)
          }}
        />
        <PurchaseReportTable records={slice} onRowSelect={setDetail} />
        <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular-nums text-center sm:text-left">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex justify-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeftIcon className="size-4" />
              Sebelumnya
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Selanjutnya
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <PurchaseDetailDialog
        open={Boolean(detail)}
        onOpenChange={(o) => !o && setDetail(null)}
        record={detail}
      />
    </div>
  )
}
