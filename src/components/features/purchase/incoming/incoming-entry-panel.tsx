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
import type { InventoryProduct } from "@/lib/inventory/types"
import type { PurchaseLine } from "@/lib/purchase/types"

type IncomingEntryPanelProps = {
  products: InventoryProduct[]
  onCompletePurchase: (record: {
    lines: PurchaseLine[]
    supplier: string
    grandTotal: number
    discount: number
    notes: string
    paymentMethod: string
    cashPaid: number
  }) => Promise<void> | void
}

function invoiceDraft() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `PMB${yy}${mm}${dd}${String(Date.now()).slice(-6)}`
}

function emptyForm(): IncomingFormValues {
  return {
    supplier: "",
    productId: "",
    harga: "",
    qty: "",
    expiry: "",
  }
}

export function IncomingEntryPanel({
  products,
  onCompletePurchase,
}: IncomingEntryPanelProps) {
  const [form, setForm] = useState<IncomingFormValues>(() =>
    emptyForm()
  )
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

  const draftInvoiceNo = useMemo(() => invoiceDraft(), [])
  const runningTotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)

  function addLine() {
    const price = Number(String(form.harga).replace(/\D/g, "")) || 0
    const q = Number(String(form.qty).replace(/\D/g, "")) || 0
    const product = products.find((p) => p.id === form.productId)

    if (!form.supplier.trim() || !product || price <= 0 || q <= 0) {
      return
    }

    const line: PurchaseLine = {
      id: `draft-${Date.now()}`,
      productId: product.id,
      barcode: product.itemId,
      productName: product.name,
      unitPrice: price,
      qty: q,
      expiry: form.expiry.trim(),
    }
    setLines((prev) => [...prev, line])
    setForm((prev) => ({
      ...prev,
      productId: "",
      harga: "",
      qty: "",
      expiry: "",
    }))
  }

  function handleUpdate(line: PurchaseLine) {
    setLines((prev) => prev.filter((l) => l.id !== line.id))
    setForm((prev) => ({
      ...prev,
      productId: line.productId ?? "",
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
          Faktur {draftInvoiceNo}
        </span>
      </div>

      <IncomingForm
        value={form}
        onChange={setForm}
        products={products}
      />

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
        onConfirm={async ({ discount, notes, paymentMethod, cashPaid }) => {
          await onCompletePurchase({
            lines,
            supplier: form.supplier.trim(),
            grandTotal: Math.max(0, runningTotal - discount),
            discount,
            notes,
            paymentMethod,
            cashPaid,
          })
          handleBatal()
        }}
      />
    </div>
  )
}
