"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomingEntryPanel } from "@/components/features/purchase/incoming/incoming-entry-panel"
import { IncomingTable } from "@/components/features/purchase/incoming/incoming-history-table"
import { PurchaseDetailDialog } from "@/components/features/purchase/shared/purchase-detail-dialog"
import { PurchaseFilters } from "@/components/features/purchase/shared/purchase-filters"
import {
  MOCK_INCOMING_GOODS,
  PURCHASE_REPORT_PAGE_SIZE,
  filterIncomingRecords,
  type IncomingGoodsRecord,
  type PurchaseLine,
} from "@/lib/purchase/mock-data"

function formatNowPurchase() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function IncomingPageClient() {
  const [history, setHistory] = useState<IncomingGoodsRecord[]>(
    MOCK_INCOMING_GOODS
  )
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("Semua")
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<IncomingGoodsRecord | null>(null)

  const filtered = useMemo(
    () => filterIncomingRecords(history, status, search),
    [history, status, search]
  )

  useEffect(() => {
    setPage(1)
  }, [search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PURCHASE_REPORT_PAGE_SIZE))
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const safePage = Math.min(page, totalPages)
  const slice = useMemo(() => {
    const start = (safePage - 1) * PURCHASE_REPORT_PAGE_SIZE
    return filtered.slice(start, start + PURCHASE_REPORT_PAGE_SIZE)
  }, [filtered, safePage])

  function handleCompletePurchase(payload: {
    lines: PurchaseLine[]
    supplier: string
    grandTotal: number
    discount: number
    notes: string
    paymentMethod: string
  }) {
    void payload.discount
    void payload.notes
    void payload.paymentMethod
    const record: IncomingGoodsRecord = {
      id: `inc-${Date.now()}`,
      invoiceNo: `PMB${String(Date.now()).slice(-10)}`,
      supplier: payload.supplier,
      purchasedAt: formatNowPurchase(),
      status: "Received",
      lines: payload.lines.map((l, i) => ({
        ...l,
        id: `${l.id}-saved-${i}`,
      })),
      grandTotal: payload.grandTotal,
    }
    setHistory((prev) => [record, ...prev])
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Tabs defaultValue="entri" className="w-full gap-6">
        <TabsList className="bg-muted/80 border-border h-auto w-full justify-start gap-1 rounded-lg border p-1 sm:w-auto">
          <TabsTrigger
            value="entri"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
          >
            Entri pembelian
          </TabsTrigger>
          <TabsTrigger
            value="riwayat"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
          >
            Riwayat masuk
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entri" className="mt-0">
          <IncomingEntryPanel onCompletePurchase={handleCompletePurchase} />
        </TabsContent>

        <TabsContent value="riwayat" className="mt-0 space-y-4">
          <PurchaseFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={{ value: status, onChange: setStatus }}
          />
          <IncomingTable records={slice} onViewDetail={setDetail} />
          <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="tabular-nums">
              Halaman {safePage} dari {totalPages}
            </p>
            <div className="flex justify-end gap-2">
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
        </TabsContent>
      </Tabs>

      <PurchaseDetailDialog
        open={Boolean(detail)}
        onOpenChange={(o) => !o && setDetail(null)}
        record={detail}
      />

      <p className="text-muted-foreground text-center text-xs sm:text-left">
        Laporan pembelian lengkap di{" "}
        <Link href="/purchase/report" className="text-primary font-medium hover:underline">
          Laporan Pembelian
        </Link>
        .
      </p>
    </div>
  )
}
