export type MemberRow = {
  id: string
  name: string
  points: number
}

export type TransactionRow = {
  dateLabel: string
  memberName: string
  memberId: string
  amountLabel: string
}

export type WeeklyRevenuePoint = {
  label: string
  amount: number
}

export type DashboardSummary = {
  userName: string
  welcomeDate: string
  revenueToday: string
  weeklyRevenue: WeeklyRevenuePoint[]
  topMembers: MemberRow[]
  recentTransactions: TransactionRow[]
}
