import { DashboardHome } from "@/components/features/dashboard/dashboard-home"
import { getDashboardSummary } from "@/lib/data/dashboard"

export default async function BerandaPage() {
  const summary = await getDashboardSummary()

  return <DashboardHome summary={summary} />
}
