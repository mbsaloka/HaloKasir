import { desc } from "drizzle-orm"

import { db, assertDatabaseConfigured } from "@/db"
import { members, salesTransactions } from "@/db/schema"
import { formatRupiah } from "@/lib/cashier/format-rupiah"
import {
  formatDashboardDateTime,
  formatShortDate,
} from "@/lib/data/format"
import { requireCurrentUser } from "@/lib/data/session"
import type { DashboardSummary } from "@/lib/dashboard/types"

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  assertDatabaseConfigured()

  const currentUser = await requireCurrentUser()
  const [memberRows, txRows] = await Promise.all([
    db.select().from(members).orderBy(desc(members.points)).limit(5),
    db
      .select()
      .from(salesTransactions)
      .orderBy(desc(salesTransactions.transactionAt))
      .limit(80),
  ])

  const now = new Date()
  const todayRevenue = txRows
    .filter((tx) => tx.status === "Selesai" && sameDay(tx.transactionAt, now))
    .reduce((sum, tx) => sum + tx.total, 0)

  const allMembersById = new Map(
    (await db.select().from(members)).map((member) => [member.id, member])
  )

  const weeklyRevenue = Array.from({ length: 7 }, (_, index) => {
    const day = startOfDay(now)
    day.setDate(day.getDate() - (6 - index))
    const amount = txRows
      .filter((tx) => tx.status === "Selesai" && sameDay(tx.transactionAt, day))
      .reduce((sum, tx) => sum + tx.total, 0)

    return {
      label: new Intl.DateTimeFormat("id-ID", { weekday: "short" })
        .format(day)
        .replace(".", ""),
      amount,
    }
  })

  return {
    userName: currentUser.name.split(" ")[0] || currentUser.name,
    welcomeDate: formatShortDate(now),
    revenueToday: formatRupiah(todayRevenue),
    weeklyRevenue,
    topMembers: memberRows.map((member) => ({
      id: member.id,
      name: member.name,
      points: member.points,
    })),
    recentTransactions: txRows.slice(0, 5).map((tx) => {
      const member = tx.memberId ? allMembersById.get(tx.memberId) : null
      return {
        dateLabel: formatDashboardDateTime(tx.transactionAt),
        memberName: member?.name ?? "Walk-in",
        memberId: member?.id ?? "-",
        amountLabel: `+ ${formatRupiah(tx.total)}`,
      }
    }),
  }
}
