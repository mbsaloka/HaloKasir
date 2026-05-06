"use client"

import dynamic from "next/dynamic"

import type { ProfitRevenuePoint } from "@/lib/sales/mock-data"

const ChartSection = dynamic(
  () =>
    import("@/components/features/sales/report/chart-section").then((m) => ({
      default: m.ChartSection,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="border-border bg-card h-[360px] rounded-xl border shadow-xs" />
    ),
  }
)

type ChartSectionDynamicProps = {
  data: ProfitRevenuePoint[]
}

/** Chart + kartu — dimuat klien-only agar Recharts tidak SSR dengan kontainer 0×0 */
export function ChartSectionDynamic({ data }: ChartSectionDynamicProps) {
  return <ChartSection data={data} />
}
