import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type SupplierBadgeProps = {
  name: string
  className?: string
}

export function SupplierBadge({ name, className }: SupplierBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-primary/25 bg-primary/5 text-foreground max-w-[220px] truncate font-normal",
        className
      )}
      title={name}
    >
      {name}
    </Badge>
  )
}
