import type { CashierProduct } from "@/lib/cashier/types"

import { ProductCard } from "./product-card"

type ProductGridProps = {
  products: CashierProduct[]
  onAdd: (product: CashierProduct) => void
}

export function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </div>
  )
}
