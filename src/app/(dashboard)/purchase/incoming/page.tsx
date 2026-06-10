import type { Metadata } from "next"

import { IncomingPageClient } from "@/components/features/purchase/incoming/incoming-page-client"
import { getInventoryProducts } from "@/lib/data/inventory"
import { getPurchaseRecords } from "@/lib/data/purchase"

export const metadata: Metadata = {
  title: "Barang Masuk",
}

export default async function PurchaseIncomingPage() {
  const [records, products] = await Promise.all([
    getPurchaseRecords(),
    getInventoryProducts(),
  ])

  return <IncomingPageClient initialHistory={records} products={products} />
}
