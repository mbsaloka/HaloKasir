import { Badge } from "@/components/ui/badge"
import type { PurchaseIncomingStatus } from "@/lib/purchase/types"
import { cn } from "@/lib/utils"

const STYLE: Record<
  PurchaseIncomingStatus,
  string
> = {
  Received:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  Pending:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
  Cancelled:
    "border-border bg-muted text-muted-foreground line-through decoration-muted-foreground/60",
}

type PurchaseStatusBadgeProps = {
  status: PurchaseIncomingStatus
  className?: string
}

export function PurchaseStatusBadge({
  status,
  className,
}: PurchaseStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", STYLE[status], className)}
    >
      {status}
    </Badge>
  )
}
