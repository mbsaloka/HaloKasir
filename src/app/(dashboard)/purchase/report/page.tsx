import type { Metadata } from "next"

import { ReportPageClient } from "@/components/features/purchase/report/report-page-client"

export const metadata: Metadata = {
  title: "Laporan Pembelian",
}

export default function PurchaseReportPage() {
  return <ReportPageClient />
}
