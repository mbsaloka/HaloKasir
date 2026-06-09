import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { WeeklyRevenuePoint } from "@/lib/dashboard/types"

type WelcomeRevenueCardProps = {
  userName: string
  welcomeDate: string
  revenueToday: string
  weeklyRevenue: WeeklyRevenuePoint[]
}

export function WelcomeRevenueCard({
  userName,
  welcomeDate,
  revenueToday,
  weeklyRevenue,
}: WelcomeRevenueCardProps) {
  const maxRevenue = Math.max(1, ...weeklyRevenue.map((point) => point.amount))

  return (
    <Card className="shadow-sm">
      <CardHeader className="gap-1 pb-2">
        <CardTitle className="text-lg font-semibold">
          Selamat datang,{" "}
          <span className="text-primary">{userName}</span>!
        </CardTitle>
        <CardDescription>
          Pendapatan Hari Ini,{" "}
          <span className="text-foreground font-medium">
            {welcomeDate}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-primary text-3xl font-bold tracking-tight md:text-4xl">
          {revenueToday}
        </p>
        <div className="mt-6 flex h-16 items-end gap-1.5">
          {weeklyRevenue.map((point) => (
            <div
              key={point.label}
              className="bg-primary hover:bg-primary/85 w-full max-w-8 rounded-t opacity-90 transition-colors"
              style={{
                height: `${Math.max(8, Math.round((point.amount / maxRevenue) * 100))}%`,
              }}
              title={`${point.label}: ${point.amount.toLocaleString("id-ID")}`}
              aria-hidden
            />
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Ringkasan pendapatan 7 hari terakhir
        </p>
      </CardContent>
    </Card>
  )
}
