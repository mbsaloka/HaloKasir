"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ProductForm,
  emptyProductForm,
  productToFormState,
  type ProductFieldErrors,
  type ProductFormState,
} from "@/components/features/inventory/form/product-form"
import type { InventoryProduct } from "@/lib/inventory/types"

export type ProductModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  product: InventoryProduct | null
  onSave: (payload: {
    mode: "create" | "edit"
    id?: string
    values: ProductFormState
    numericPrice: number
    numericStock: number
  }) => void | Promise<void>
}

function validate(
  v: ProductFormState
): { ok: true } | { ok: false; errors: ProductFieldErrors } {
  const errors: ProductFieldErrors = {}
  if (!v.name.trim()) errors.name = "Nama wajib diisi."
  if (!v.category) errors.category = "Pilih kategori."

  const price = Number(String(v.price).replace(/\./g, "").replace(",", "."))
  if (Number.isNaN(price) || price < 0) {
    errors.price = "Harga tidak valid."
  }
  const stock = Number(String(v.stock).replace(/\D/g, ""))
  if (Number.isNaN(stock) || stock < 0) {
    errors.stock = "Stok tidak valid."
  }

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true }
}

export function ProductModal({
  open,
  onOpenChange,
  mode,
  product,
  onSave,
}: ProductModalProps) {
  const reactId = useId()
  const idPrefix = `product-form-${reactId.replace(/:/g, "")}`

  const [form, setForm] = useState<ProductFormState>(emptyProductForm)
  const [errors, setErrors] = useState<ProductFieldErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    if (mode === "edit" && product) {
      setForm(productToFormState(product))
    } else {
      setForm(emptyProductForm())
    }
  }, [open, mode, product])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = validate(form)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    const numericPrice = Number(
      String(form.price).replace(/\./g, "").replace(",", ".")
    )
    const numericStock = Number(String(form.stock).replace(/\D/g, ""))
    setIsSaving(true)
    try {
      await onSave({
        mode,
        id: product?.id,
        values: form,
        numericPrice,
        numericStock,
      })
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  const title =
    mode === "create" ? "Stok Barang Baru" : "Edit Stok Barang"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 sm:max-w-lg"
        showCloseButton
        onOpenAutoFocus={(ev) => ev.preventDefault()}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <ProductForm
            idPrefix={idPrefix}
            value={form}
            onChange={setForm}
            errors={errors}
          />

          <DialogFooter className="border-border gap-2 border-t pt-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
