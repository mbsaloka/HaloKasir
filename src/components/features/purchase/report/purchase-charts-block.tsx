"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type {
  PurchaseTrendPoint,
  SupplierSpend,
} from "@/lib/purchase/mock-data"

const PRIMARY = "#1D8AD8"

type PurchaseChartsBlockProps = {
  trend: PurchaseTrendPoint[]
  supplierSpend: SupplierSpend[]
}

export function PurchaseChartsBlock({
  trend,
  supplierSpend,
}: PurchaseChartsBlockProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card size="sm" className="shadow-xs">
        <CardHeader className="border-border border-b pb-3">
          <CardTitle className="text-sm font-medium">
            Tren nilai pembelian
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trend}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) =>
                    `${Number(v) >= 1_000_000 ? `${Math.round(Number(v) / 1_000_000)}jt` : v}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                  formatter={(value) =>
                    typeof value === "number"
                      ? value.toLocaleString("id-ID")
                      : String(value ?? "")
                  }
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Nilai (Rp)"
                  stroke={PRIMARY}
                  strokeWidth={2}
                  dot={{ r: 3, fill: PRIMARY }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card size="sm" className="shadow-xs">
        <CardHeader className="border-border border-b pb-3">
          <CardTitle className="text-sm font-medium">
            Pembelian per pemasok (mock)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={supplierSpend}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-border"
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) =>
                    `${Number(v) >= 1_000_000 ? `${Math.round(Number(v) / 1_000_000)}jt` : v}`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="supplier"
                  width={88}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                  formatter={(value) =>
                    typeof value === "number"
                      ? value.toLocaleString("id-ID")
                      : String(value ?? "")
                  }
                />
                <Bar
                  dataKey="amount"
                  name="Nilai"
                  fill={PRIMARY}
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
