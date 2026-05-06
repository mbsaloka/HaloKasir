import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatRupiahCompact } from "@/lib/cashier/format-rupiah"
import type { CashierProduct } from "@/lib/cashier/mock-products"

type ProductCardProps = {
  product: CashierProduct
  onAdd: (product: CashierProduct) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card
      size="sm"
      className="group/card border-border relative gap-0 overflow-hidden py-0 shadow-xs transition-shadow hover:shadow-md"
    >
      <div className="bg-muted/60 relative aspect-[4/3] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- placeholder SVG lokal, tanpa optimizer */}
        <img
          src={product.imageSrc}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <span className="bg-background/85 absolute top-2 left-2 rounded px-2 py-0.5 text-[10px] font-medium shadow-xs">
          {product.category}
        </span>
        <span className="text-muted-foreground absolute top-2 right-2 rounded bg-white/90 px-2 py-0.5 text-[10px] tabular-nums shadow-xs">
          {product.sku}
        </span>
      </div>
      <div className="flex flex-col gap-2 px-3 pt-2 pb-3">
        <p className="line-clamp-2 min-h-10 text-sm leading-snug font-semibold">
          {product.name}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold tabular-nums">
            {formatRupiahCompact(product.price)}
          </span>
          <Button
            type="button"
            size="icon-sm"
            className="size-9 shrink-0 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            aria-label={`Tambah ${product.name}`}
            onClick={() => onAdd(product)}
          >
            <PlusIcon className="size-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
