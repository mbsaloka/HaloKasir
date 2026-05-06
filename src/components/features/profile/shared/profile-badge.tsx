import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ProfileBadgeProps = {
  role: string
  className?: string
}

export function ProfileBadge({ role, className }: ProfileBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-primary/30 bg-primary/5 text-primary font-medium",
        className
      )}
    >
      {role}
    </Badge>
  )
}
