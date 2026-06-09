import type { Metadata } from "next"

import { BestSellingCategoryCard } from "@/components/features/sales/report/best-selling-category-card"
import { BestSellingProductCard } from "@/components/features/sales/report/best-selling-product-card"
import { ChartSectionDynamic } from "@/components/features/sales/report/chart-section-dynamic"
import { SalesOverviewSection } from "@/components/features/sales/report/sales-overview-section"
import { getSalesReportData } from "@/lib/data/sales"

export const metadata: Metadata = {
  title: "Laporan Penjualan",
}

export default async function SalesReportPage() {
  const report = await getSalesReportData()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <SalesOverviewSection metrics={report.metrics} />
        <BestSellingCategoryCard categories={report.bestCategories} />
      </div>

      <ChartSectionDynamic data={report.series} />

      <BestSellingProductCard products={report.bestProducts} />
    </div>
  )
}
