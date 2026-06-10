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
import type { PurchaseLine } from "@/lib/purchase/types"

type IncomingLinesTableProps = {
  lines: PurchaseLine[]
  onUpdate: (line: PurchaseLine) => void
  onRemove: (id: string) => void
}

export function IncomingLinesTable({
  lines,
  onUpdate,
  onRemove,
}: IncomingLinesTableProps) {
  return (
    <div className="border-border overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10">#</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Harga Beli</TableHead>
            <TableHead className="text-right">Kuantitas</TableHead>
            <TableHead>Kadaluwarsa</TableHead>
            <TableHead className="text-right">Total Harga</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-muted-foreground p-8 text-center"
              >
                Belum ada baris. Isi form dan klik Tambah.
              </TableCell>
            </TableRow>
          ) : (
            lines.map((l, i) => (
              <TableRow key={l.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{l.productName}</span>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      ID Item {l.barcode}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {l.unitPrice.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right tabular-nums">{l.qty}</TableCell>
                <TableCell>{l.expiry || "-"}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {(l.unitPrice * l.qty).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 border-0 bg-emerald-700 text-white hover:bg-emerald-800"
                      onClick={() => onUpdate(l)}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="h-7"
                      onClick={() => onRemove(l.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
