import type { CashierProduct } from "@/lib/cashier/types"

import { ProductCard } from "./product-card"

type ProductGridProps = {
  products: CashierProduct[]
  cartQuantityById?: ReadonlyMap<string, number>
  onAdd: (product: CashierProduct) => void
}

export function ProductGrid({
  products,
  cartQuantityById,
  onAdd,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          reservedQuantity={cartQuantityById?.get(p.id) ?? 0}
          onAdd={onAdd}
        />
      ))}
    </div>
  )
}
