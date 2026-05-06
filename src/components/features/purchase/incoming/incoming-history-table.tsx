"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PurchaseStatusBadge } from "@/components/features/purchase/shared/status-badge"
import { SupplierBadge } from "@/components/features/purchase/shared/supplier-badge"
import { formatRupiah } from "@/lib/cashier/format-rupiah"
import type { IncomingGoodsRecord } from "@/lib/purchase/mock-data"

type IncomingHistoryTableProps = {
  records: IncomingGoodsRecord[]
  onViewDetail: (r: IncomingGoodsRecord) => void
}

export function IncomingHistoryTable({
  records,
  onViewDetail,
}: IncomingHistoryTableProps) {
  return (
    <div className="border-border overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Faktur</TableHead>
            <TableHead>Pemasok</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-right">Qty diterima</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-muted-foreground p-8 text-center"
              >
                Tidak ada data.
              </TableCell>
            </TableRow>
          ) : (
            records.map((r) => {
              const qty = r.lines.reduce((s, l) => s + l.qty, 0)
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium tabular-nums">
                    {r.invoiceNo}
                  </TableCell>
                  <TableCell>
                    <SupplierBadge name={r.supplier} />
                  </TableCell>
                  <TableCell className="tabular-nums">{r.purchasedAt}</TableCell>
                  <TableCell className="text-right tabular-nums">{qty}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatRupiah(r.grandTotal)}
                  </TableCell>
                  <TableCell>
                    <PurchaseStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => onViewDetail(r)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

/** Alias arsitektur */
export const IncomingTable = IncomingHistoryTable
