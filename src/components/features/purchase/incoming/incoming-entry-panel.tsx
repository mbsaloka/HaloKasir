"use client"

import { useMemo, useState } from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  IncomingForm,
  type IncomingFormValues,
} from "@/components/features/purchase/incoming/incoming-form"
import { IncomingLinesTable } from "@/components/features/purchase/incoming/incoming-lines-table"
import { TotalPembelianModal } from "@/components/features/purchase/incoming/incoming-modal"
import {
  MOCK_PURCHASE_INVOICE_DRAFT,
  MOCK_SUPPLIERS,
  type PurchaseLine,
} from "@/lib/purchase/mock-data"

type IncomingEntryPanelProps = {
  onCompletePurchase: (record: {
    lines: PurchaseLine[]
    supplier: string
    grandTotal: number
    discount: number
    notes: string
    paymentMethod: string
  }) => void
}

const emptyForm = (): IncomingFormValues => ({
  supplier: MOCK_SUPPLIERS[0],
  barcode: "",
  nama: "",
  harga: "",
  qty: "",
  expiry: "",
})

export function IncomingEntryPanel({ onCompletePurchase }: IncomingEntryPanelProps) {
  const [form, setForm] = useState<IncomingFormValues>(emptyForm)
  const [lines, setLines] = useState<PurchaseLine[]>([])
  const [totalModalOpen, setTotalModalOpen] = useState(false)

  const nowLabel = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date())
  }, [])

  const runningTotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)

  function addLine() {
    const price = Number(String(form.harga).replace(/\D/g, "")) || 0
    const q = Number(String(form.qty).replace(/\D/g, "")) || 0
    if (
      !form.barcode.trim() ||
      !form.nama.trim() ||
      !form.expiry.trim() ||
      price <= 0 ||
      q <= 0
    ) {
      return
    }
    const line: PurchaseLine = {
      id: `draft-${Date.now()}`,
      barcode: form.barcode.trim(),
      productName: form.nama.trim(),
      unitPrice: price,
      qty: q,
      expiry: form.expiry.trim(),
    }
    setLines((prev) => [...prev, line])
    setForm((prev) => ({
      ...prev,
      barcode: "",
      nama: "",
      harga: "",
      qty: "",
      expiry: "",
    }))
  }

  function handleUpdate(line: PurchaseLine) {
    setLines((prev) => prev.filter((l) => l.id !== line.id))
    setForm((prev) => ({
      ...prev,
      barcode: line.barcode,
      nama: line.productName,
      harga: String(line.unitPrice),
      qty: String(line.qty),
      expiry: line.expiry,
    }))
  }

  function handleBatal() {
    setLines([])
    setForm(emptyForm())
  }

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground flex flex-col gap-1 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span>{nowLabel}</span>
        <span className="font-medium text-foreground">
          Faktur {MOCK_PURCHASE_INVOICE_DRAFT}
        </span>
      </div>

      <IncomingForm value={form} onChange={setForm} />

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" className="sm:ml-auto" onClick={addLine}>
          Tambah
        </Button>
        <p className="text-right text-3xl font-bold tabular-nums sm:min-w-[200px]">
          {runningTotal.toLocaleString("id-ID")}
        </p>
      </div>

      <IncomingLinesTable
        lines={lines}
        onUpdate={handleUpdate}
        onRemove={(id) => setLines((prev) => prev.filter((l) => l.id !== id))}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          className="h-11 gap-2 bg-orange-500 text-white hover:bg-orange-600"
          onClick={handleBatal}
        >
          <XIcon className="size-4" />
          Batal
        </Button>
        <Button
          type="button"
          className="h-11 bg-emerald-700 text-white hover:bg-emerald-800"
          disabled={lines.length === 0}
          onClick={() => setTotalModalOpen(true)}
        >
          Simpan
        </Button>
      </div>

      <TotalPembelianModal
        open={totalModalOpen}
        onOpenChange={setTotalModalOpen}
        subtotal={runningTotal}
        onConfirm={({ discount, notes, paymentMethod }) => {
          onCompletePurchase({
            lines,
            supplier: form.supplier,
            grandTotal: Math.max(0, runningTotal - discount),
            discount,
            notes,
            paymentMethod,
          })
          handleBatal()
        }}
      />
    </div>
  )
}
