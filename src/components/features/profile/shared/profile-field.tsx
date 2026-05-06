import { cn } from "@/lib/utils"

type ProfileFieldProps = {
  label: string
  value: string
  className?: string
}

export function ProfileField({ label, value, className }: ProfileFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className="text-foreground text-sm font-medium break-words">{value}</p>
    </div>
  )
}
