import type { Metadata } from "next"

import { ReportPageClient } from "@/components/features/purchase/report/report-page-client"
import { getPurchaseReportData } from "@/lib/data/purchase"

export const metadata: Metadata = {
  title: "Laporan Pembelian",
}

export default async function PurchaseReportPage() {
  const report = await getPurchaseReportData()

  return <ReportPageClient report={report} />
}
