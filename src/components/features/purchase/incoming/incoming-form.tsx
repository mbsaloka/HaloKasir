"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_SUPPLIERS } from "@/lib/purchase/mock-data"

export type IncomingFormValues = {
  supplier: string
  barcode: string
  nama: string
  harga: string
  qty: string
  expiry: string
}

type IncomingFormProps = {
  value: IncomingFormValues
  onChange: (next: IncomingFormValues) => void
}

/** Form entri baris pembelian (Figma: grid Pemasok / Barcode / Produk / Harga / Qty / ED) */
export function IncomingForm({ value, onChange }: IncomingFormProps) {
  function patch(partial: Partial<IncomingFormValues>) {
    onChange({ ...value, ...partial })
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground text-xs">Pemasok</Label>
            <Select
              value={value.supplier}
              onValueChange={(v) => patch({ supplier: v })}
            >
              <SelectTrigger className="bg-background w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_SUPPLIERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Barcode</Label>
            <Input
              value={value.barcode}
              onChange={(e) => patch({ barcode: e.target.value })}
              placeholder="Tulis"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Nama Produk</Label>
            <Input
              value={value.nama}
              onChange={(e) => patch({ nama: e.target.value })}
              placeholder="Tulis"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Harga Beli</Label>
            <Input
              inputMode="numeric"
              value={value.harga}
              onChange={(e) => patch({ harga: e.target.value })}
              placeholder="Tulis"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Kuantitas</Label>
            <Input
              inputMode="numeric"
              value={value.qty}
              onChange={(e) => patch({ qty: e.target.value })}
              placeholder="Tulis"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground text-xs">Kadaluwarsa</Label>
            <Input
              value={value.expiry}
              onChange={(e) => patch({ expiry: e.target.value })}
              placeholder="DD/MM/YYYY"
            />
          </div>
        </div>
      </div>
    </>
  )
}
