"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatRupiah } from "@/lib/cashier/format-rupiah"
import type { IncomingGoodsRecord } from "@/lib/purchase/types"

type PurchaseDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: IncomingGoodsRecord | null
  title?: string
}

export function PurchaseDetailDialog({
  open,
  onOpenChange,
  record,
  title = "Riwayat Pembelian",
}: PurchaseDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90vh,720px)] gap-0 overflow-y-auto sm:max-w-3xl"
        showCloseButton
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>

        {record ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs">Faktur</Label>
                <Input readOnly value={record.invoiceNo} className="bg-muted/40" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs">Tanggal</Label>
                <Input readOnly value={record.purchasedAt} className="bg-muted/40" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs">Pemasok</Label>
                <Input readOnly value={record.supplier} className="bg-muted/40" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs">
                  Total Harga
                </Label>
                <Input
                  readOnly
                  value={formatRupiah(record.grandTotal)}
                  className="bg-muted/40"
                />
              </div>
            </div>

            <div className="border-border mt-4 rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead className="text-right">Kuantitas</TableHead>
                    <TableHead>Kadaluwarsa</TableHead>
                    <TableHead className="text-right">Total Harga</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {record.lines.map((l, i) => (
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
                        {formatRupiah(l.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {l.qty}
                      </TableCell>
                      <TableCell>{l.expiry || "-"}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatRupiah(l.unitPrice * l.qty)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : null}

        <DialogFooter className="mt-6 border-border border-t pt-4">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Kembali
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
