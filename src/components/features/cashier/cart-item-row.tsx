"use client"

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatRupiah, formatRupiahCompact } from "@/lib/cashier/format-rupiah"
import type { CashierProduct } from "@/lib/cashier/types"

type CartItemRowProps = {
  product: CashierProduct
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

export function CartItemRow({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) {
  const lineTotal = product.price * quantity

  return (
    <div className="border-border hover:bg-muted/40 flex gap-3 border-b py-3 pr-1 transition-colors last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{product.name}</p>
        <p className="text-muted-foreground text-xs tabular-nums">{product.sku}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            className="size-8"
            aria-label="Kurangi"
            onClick={onDecrement}
          >
            <MinusIcon className="size-3.5" />
          </Button>
          <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <Button
            type="button"
            size="icon-xs"
            className="size-8 bg-emerald-600 text-white hover:bg-emerald-700"
            aria-label="Tambah"
            onClick={onIncrement}
          >
            <PlusIcon className="size-3.5" />
          </Button>
        </div>
        <div className="text-right text-xs leading-tight sm:text-sm">
          <p className="text-muted-foreground">@ {formatRupiah(product.price)}</p>
          <p className="font-semibold tabular-nums">
            {formatRupiahCompact(lineTotal)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-destructive hover:text-destructive size-8 shrink-0"
          aria-label="Hapus item"
          onClick={onRemove}
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
