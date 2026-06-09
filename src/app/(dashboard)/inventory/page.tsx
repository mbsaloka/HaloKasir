import type { Metadata } from "next"

import { InventoryPageClient } from "@/components/features/inventory/inventory-page-client"
import { getInventoryProducts } from "@/lib/data/inventory"

export const metadata: Metadata = {
  title: "Persediaan",
}

export default async function InventoryPage() {
  const products = await getInventoryProducts()

  return <InventoryPageClient initialProducts={products} />
}
