import { Badge } from "@/components/ui/badge"
import type { StockLevel } from "@/lib/inventory/stock-status"
import { cn } from "@/lib/utils"

const LABEL: Record<StockLevel, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
}

const STYLE: Record<StockLevel, string> = {
  in_stock:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  low_stock:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
  out_of_stock:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
}

type StockBadgeProps = {
  level: StockLevel
  className?: string
}

export function StockBadge({ level, className }: StockBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", STYLE[level], className)}
    >
      {LABEL[level]}
    </Badge>
  )
}
