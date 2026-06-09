"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SalesChart } from "@/components/features/sales/charts/sales-chart"
import type { ProfitRevenuePoint } from "@/lib/sales/types"

type ChartSectionProps = {
  data: ProfitRevenuePoint[]
}

export function ChartSection({ data }: ChartSectionProps) {
  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle>Profit &amp; Revenue</CardTitle>
        <CardAction>
          <Select defaultValue="weekly">
            <SelectTrigger className="bg-background h-8 w-[120px] border-border shadow-xs">
              <SelectValue placeholder="Periode" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        <SalesChart data={data} />
      </CardContent>
    </Card>
  )
}
