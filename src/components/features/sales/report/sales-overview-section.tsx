import Link from "next/link"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { RevenueCard } from "@/components/features/sales/revenue-card"
import type { OverviewMetric } from "@/lib/sales/types"

type SalesOverviewSectionProps = {
  metrics: OverviewMetric[]
}

export function SalesOverviewSection({ metrics }: SalesOverviewSectionProps) {
  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle>Overview</CardTitle>
        <CardAction>
          <Link
            href="/sales/transactions"
            className="text-primary text-sm font-medium hover:underline"
          >
            See All Transactions
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-3">
          {metrics.map((m) => (
            <RevenueCard key={m.id} label={m.label} value={m.value} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
