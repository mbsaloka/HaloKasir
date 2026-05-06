import type { Metadata } from "next"

import { InventoryPageClient } from "@/components/features/inventory/inventory-page-client"

export const metadata: Metadata = {
  title: "Persediaan",
}

export default function InventoryPage() {
  return <InventoryPageClient />
}
