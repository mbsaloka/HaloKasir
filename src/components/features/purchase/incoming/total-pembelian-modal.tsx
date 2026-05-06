"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TotalPembelianModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subtotal: number
  onConfirm: (payload: {
    discount: number
    notes: string
    paymentMethod: string
    cashPaid: number
  }) => void
}

function formatIdr(n: number) {
  return n.toLocaleString("id-ID")
}

export function TotalPembelianModal({
  open,
  onOpenChange,
  subtotal,
  onConfirm,
}: TotalPembelianModalProps) {
  const [diskon, setDiskon] = useState("0")
  const [catatan, setCatatan] = useState("")
  const [metode, setMetode] = useState("Tunai")
  const [tunai, setTunai] = useState("")

  useEffect(() => {
    if (open) {
      setDiskon("0")
      setCatatan("")
      setMetode("Tunai")
      setTunai(formatIdr(subtotal))
    }
  }, [open, subtotal])

  const diskonNum = Number(String(diskon).replace(/\D/g, "")) || 0
  const tunaiNum = Number(String(tunai).replace(/\D/g, "")) || 0
  const total = Math.max(0, subtotal - diskonNum)

  function handleSimpan() {
    onConfirm({
      discount: diskonNum,
      notes: catatan,
      paymentMethod: metode,
      cashPaid: tunaiNum,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-base">Total Pembelian</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Subtotal</Label>
            <Input readOnly value={formatIdr(subtotal)} className="bg-muted/40" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Diskon</Label>
            <Input
              inputMode="numeric"
              value={diskon}
              onChange={(e) => setDiskon(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Total</Label>
            <Input readOnly value={formatIdr(total)} className="bg-muted/40" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Catatan</Label>
            <Input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tulis"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">
              Metode Pembayaran
            </Label>
            <Select value={metode} onValueChange={setMetode}>
              <SelectTrigger className="bg-background w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tunai">Tunai</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
                <SelectItem value="Tempo">Tempo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {metode === "Tunai" ? (
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Tunai</Label>
              <Input
                inputMode="numeric"
                value={tunai}
                onChange={(e) => setTunai(e.target.value)}
                placeholder={formatIdr(total)}
              />
            </div>
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Kembali
          </Button>
          <Button type="button" onClick={handleSimpan}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
