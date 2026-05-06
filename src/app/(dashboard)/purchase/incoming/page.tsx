import type { Metadata } from "next"

import { IncomingPageClient } from "@/components/features/purchase/incoming/incoming-page-client"

export const metadata: Metadata = {
  title: "Barang Masuk",
}

export default function PurchaseIncomingPage() {
  return <IncomingPageClient />
}
