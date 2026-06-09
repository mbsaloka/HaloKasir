import { MemberPointsCard } from "@/components/features/dashboard/member-points-card"
import { RecentTransactionsCard } from "@/components/features/dashboard/recent-transactions-card"
import { WelcomeRevenueCard } from "@/components/features/dashboard/welcome-revenue-card"
import type { DashboardSummary } from "@/lib/dashboard/types"

type DashboardHomeProps = {
  summary: DashboardSummary
}

export function DashboardHome({ summary }: DashboardHomeProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <WelcomeRevenueCard
            userName={summary.userName}
            welcomeDate={summary.welcomeDate}
            revenueToday={summary.revenueToday}
            weeklyRevenue={summary.weeklyRevenue}
          />
          <MemberPointsCard members={summary.topMembers} />
        </div>
        <RecentTransactionsCard transactions={summary.recentTransactions} />
      </div>
    </div>
  )
}
