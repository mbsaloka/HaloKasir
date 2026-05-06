import type { Metadata } from "next"

import { BestSellingCategoryCard } from "@/components/features/sales/report/best-selling-category-card"
import { BestSellingProductCard } from "@/components/features/sales/report/best-selling-product-card"
import { ChartSectionDynamic } from "@/components/features/sales/report/chart-section-dynamic"
import { SalesOverviewSection } from "@/components/features/sales/report/sales-overview-section"
import {
  MOCK_BEST_CATEGORIES,
  MOCK_BEST_PRODUCTS,
  MOCK_OVERVIEW_METRICS,
  MOCK_PROFIT_REVENUE_SERIES,
} from "@/lib/sales/mock-data"

export const metadata: Metadata = {
  title: "Laporan Penjualan",
}

export default function SalesReportPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <SalesOverviewSection metrics={MOCK_OVERVIEW_METRICS} />
        <BestSellingCategoryCard categories={MOCK_BEST_CATEGORIES} />
      </div>

      <ChartSectionDynamic data={MOCK_PROFIT_REVENUE_SERIES} />

      <BestSellingProductCard products={MOCK_BEST_PRODUCTS} />
    </div>
  )
}
