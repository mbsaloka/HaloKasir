"use client"

import dynamic from "next/dynamic"

import type {
  PurchaseTrendPoint,
  SupplierSpend,
} from "@/lib/purchase/mock-data"

const PurchaseChartsBlock = dynamic(
  () =>
    import("@/components/features/purchase/report/purchase-charts-block").then(
      (m) => ({ default: m.PurchaseChartsBlock })
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-border bg-card h-[340px] rounded-xl border shadow-xs" />
        <div className="border-border bg-card h-[340px] rounded-xl border shadow-xs" />
      </div>
    ),
  }
)

type PurchaseChartsDynamicProps = {
  trend: PurchaseTrendPoint[]
  supplierSpend: SupplierSpend[]
}

export function PurchaseChartsDynamic({
  trend,
  supplierSpend,
}: PurchaseChartsDynamicProps) {
  return (
    <PurchaseChartsBlock trend={trend} supplierSpend={supplierSpend} />
  )
}
