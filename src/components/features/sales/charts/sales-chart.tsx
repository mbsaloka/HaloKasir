"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ProfitRevenuePoint } from "@/lib/sales/types"
import { cn } from "@/lib/utils"

const REVENUE_COLOR = "#1D8AD8"
const PROFIT_COLOR = "#94a3b8"

type SalesChartProps = {
  data: ProfitRevenuePoint[]
  className?: string
}

export function SalesChart({ data, className }: SalesChartProps) {
  return (
    <div className={cn("h-[280px] w-full min-w-0", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
              `${Number(v) >= 1000 ? `${Math.round(v / 1000)}k` : v}`
            }
            domain={[0, 80_000]}
            ticks={[0, 20_000, 40_000, 60_000, 80_000]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: 12,
            }}
            formatter={(value) =>
              value === undefined || value === null
                ? ""
                : typeof value === "number"
                  ? value.toLocaleString("id-ID")
                  : String(value)
            }
            labelFormatter={(label) => `Bulan ${label}`}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke={REVENUE_COLOR}
            strokeWidth={2}
            dot={{ r: 3, fill: REVENUE_COLOR }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            name="Profit"
            stroke={PROFIT_COLOR}
            strokeWidth={2}
            dot={{ r: 3, fill: PROFIT_COLOR }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
