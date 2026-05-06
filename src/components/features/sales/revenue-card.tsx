import { cn } from "@/lib/utils"

import { formatSalesMetric } from "@/lib/sales/format"

type RevenueCardProps = {
  label: string
  value: number
  className?: string
}

/** Kartu metrik tunggal — dipakai grid Overview */
export function RevenueCard({ label, value, className }: RevenueCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/80 bg-muted/30 px-3 py-2.5",
        className
      )}
    >
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className="text-foreground mt-0.5 font-semibold tabular-nums">
        {formatSalesMetric(value)}
      </p>
    </div>
  )
}
