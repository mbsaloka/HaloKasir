import { MemberPointsCard } from "@/components/features/dashboard/member-points-card"
import { RecentTransactionsCard } from "@/components/features/dashboard/recent-transactions-card"
import { WelcomeRevenueCard } from "@/components/features/dashboard/welcome-revenue-card"

export function DashboardHome() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <WelcomeRevenueCard />
          <MemberPointsCard />
        </div>
        <RecentTransactionsCard />
      </div>
    </div>
  )
}
