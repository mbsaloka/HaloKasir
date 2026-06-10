"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { InventoryProduct } from "@/lib/inventory/types"

export type IncomingFormValues = {
  supplier: string
  productId: string
  harga: string
  qty: string
  expiry: string
}

type IncomingFormProps = {
  value: IncomingFormValues
  onChange: (next: IncomingFormValues) => void
  products: InventoryProduct[]
}

type ProductSearchSelectProps = {
  products: InventoryProduct[]
  value: string
  onChange: (productId: string) => void
}

function ProductSearchSelect({
  products,
  value,
  onChange,
}: ProductSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = products.find((product) => product.id === value) ?? null
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = q
      ? products.filter((product) => {
          const searchable = [
            product.name,
            product.itemId,
            product.stockId,
            product.category,
          ]
            .join(" ")
            .toLowerCase()

          return searchable.includes(q)
        })
      : products

    return matches.slice(0, 60)
  }, [products, query])

  useEffect(() => {
    if (!open) return

    const id = window.setTimeout(() => searchRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="outline"
        className="border-border bg-background h-10 w-full justify-between shadow-xs"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        {selected ? (
          <span className="min-w-0 text-left">
            <span className="block truncate font-medium">{selected.name}</span>
            <span className="text-muted-foreground block truncate text-xs">
              ID Item {selected.itemId} - Stok {selected.stock}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">Pilih item</span>
        )}
        <ChevronsUpDownIcon className="text-muted-foreground size-4" />
      </Button>

      {open ? (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border shadow-md">
          <div className="relative p-2">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false)
              }}
              placeholder="Cari item"
              className="bg-background h-9 pl-9"
            />
          </div>

          <div
            role="listbox"
            className="max-h-64 overflow-y-auto p-1"
            aria-label="Pilih item pembelian"
          >
            {filtered.length === 0 ? (
              <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                Tidak ada item.
              </p>
            ) : (
              filtered.map((product) => {
                const active = product.id === value

                return (
                  <button
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                      active && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onChange(product.id)
                      setOpen(false)
                      setQuery("")
                    }}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {product.name}
                      </span>
                      <span className="text-muted-foreground block truncate text-xs">
                        ID Item {product.itemId} - ID Stok {product.stockId} -{" "}
                        {product.category}
                      </span>
                    </span>
                    {active ? <CheckIcon className="size-4" /> : null}
                  </button>
                )
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Form entri baris pembelian barang masuk. */
export function IncomingForm({
  value,
  onChange,
  products,
}: IncomingFormProps) {
  function patch(partial: Partial<IncomingFormValues>) {
    onChange({ ...value, ...partial })
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground text-xs">Pemasok</Label>
            <Input
              value={value.supplier}
              onChange={(e) => patch({ supplier: e.target.value })}
              placeholder="Tulis nama pemasok"
              className="border-border bg-background shadow-xs"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground text-xs">Item</Label>
            <ProductSearchSelect
              products={products}
              value={value.productId}
              onChange={(productId) => patch({ productId })}
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
              className="border-border bg-background shadow-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Kuantitas</Label>
            <Input
              inputMode="numeric"
              value={value.qty}
              onChange={(e) => patch({ qty: e.target.value })}
              placeholder="Tulis"
              className="border-border bg-background shadow-xs"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-muted-foreground text-xs">Kadaluwarsa</Label>
            <Input
              value={value.expiry}
              onChange={(e) => patch({ expiry: e.target.value })}
              placeholder="Opsional"
              className="border-border bg-background shadow-xs"
            />
          </div>
        </div>
      </div>
    </>
  )
}
