import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  MEMBERSHIP_TIER_LABELS,
  type MembershipTier,
} from "@/lib/membership/types"

const tierStyles: Record<MembershipTier, string> = {
  regular:
    "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-950/40 dark:text-slate-200",
  silver:
    "border-slate-400 bg-slate-100 text-slate-800 dark:border-slate-500 dark:bg-slate-900/60 dark:text-slate-100",
  gold: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-600/60 dark:bg-amber-950/50 dark:text-amber-100",
}

export function MembershipBadge({
  tier,
  className,
}: {
  tier: MembershipTier
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-md px-2 text-xs font-medium",
        tierStyles[tier],
        className
      )}
    >
      {MEMBERSHIP_TIER_LABELS[tier]}
    </Badge>
  )
}
