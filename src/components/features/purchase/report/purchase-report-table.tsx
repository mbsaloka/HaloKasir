"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SupplierBadge } from "@/components/features/purchase/shared/supplier-badge"
import { formatRupiah } from "@/lib/cashier/format-rupiah"
import type { IncomingGoodsRecord } from "@/lib/purchase/mock-data"

type PurchaseReportTableProps = {
  records: IncomingGoodsRecord[]
  onRowSelect: (r: IncomingGoodsRecord) => void
}

export function PurchaseReportTable({
  records,
  onRowSelect,
}: PurchaseReportTableProps) {
  return (
    <div className="border-border overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Faktur</TableHead>
            <TableHead>Pemasok</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-right">Total Harga Pembelian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-muted-foreground p-8 text-center"
              >
                Tidak ada data.
              </TableCell>
            </TableRow>
          ) : (
            records.map((r) => (
              <TableRow
                key={r.id}
                className="cursor-pointer"
                onClick={() => onRowSelect(r)}
              >
                <TableCell className="font-medium tabular-nums">
                  {r.invoiceNo}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <SupplierBadge name={r.supplier} />
                </TableCell>
                <TableCell className="tabular-nums">{r.purchasedAt}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {formatRupiah(r.grandTotal)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
