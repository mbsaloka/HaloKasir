import type { Metadata } from "next"

import { IncomingPageClient } from "@/components/features/purchase/incoming/incoming-page-client"
import { getPurchaseRecords, getSuppliers } from "@/lib/data/purchase"

export const metadata: Metadata = {
  title: "Barang Masuk",
}

export default async function PurchaseIncomingPage() {
  const [records, suppliers] = await Promise.all([
    getPurchaseRecords(),
    getSuppliers(),
  ])

  return <IncomingPageClient initialHistory={records} suppliers={suppliers} />
}
