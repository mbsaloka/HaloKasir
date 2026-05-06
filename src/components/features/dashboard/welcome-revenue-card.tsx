import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MOCK_REVENUE_TODAY,
  MOCK_USER_NAME,
  MOCK_WELCOME_DATE,
} from "@/lib/dashboard/mock-data"

export function WelcomeRevenueCard() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="gap-1 pb-2">
        <CardTitle className="text-lg font-semibold">
          Selamat datang,{" "}
          <span className="text-primary">{MOCK_USER_NAME}</span>!
        </CardTitle>
        <CardDescription>
          Pendapatan Hari Ini,{" "}
          <span className="text-foreground font-medium">
            {MOCK_WELCOME_DATE}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-primary text-3xl font-bold tracking-tight md:text-4xl">
          {MOCK_REVENUE_TODAY}
        </p>
        <div className="mt-6 flex h-16 items-end gap-1.5">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div
              key={i}
              className="bg-primary hover:bg-primary/85 w-full max-w-8 rounded-t opacity-90 transition-colors"
              style={{ height: `${h}%` }}
              aria-hidden
            />
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Ringkasan mingguan (placeholder)
        </p>
      </CardContent>
    </Card>
  )
}
