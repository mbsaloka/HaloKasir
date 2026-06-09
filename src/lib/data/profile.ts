import { desc, eq } from "drizzle-orm"

import { db } from "@/db"
import { accountHistory } from "@/db/schema"
import { formatDisplayDateTime } from "@/lib/data/format"
import { requireCurrentUser, type CurrentUser } from "@/lib/data/session"
import type { AccountHistoryAction, AccountHistoryRow, UserProfile } from "@/lib/profile/types"

export type ProfilePageData = {
  profile: UserProfile
  history: AccountHistoryRow[]
  menuUser: CurrentUser
}

export function mapUserToProfile(user: CurrentUser): UserProfile {
  return {
    displayName: user.name,
    username: user.username ?? user.email.split("@")[0],
    passwordDisplay: "********",
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    address: user.address ?? "",
    avatarSrc: user.image,
  }
}

export async function getAccountHistoryRows(
  userId: string
): Promise<AccountHistoryRow[]> {
  const rows = await db
    .select()
    .from(accountHistory)
    .where(eq(accountHistory.userId, userId))
    .orderBy(desc(accountHistory.at))
    .limit(48)

  return rows.map((row) => ({
    id: row.id,
    at: formatDisplayDateTime(row.at),
    router: row.router,
    description: row.description,
    action: row.action as AccountHistoryAction,
  }))
}

export async function getProfilePageData(): Promise<ProfilePageData> {
  const currentUser = await requireCurrentUser()
  const history = await getAccountHistoryRows(currentUser.id)

  return {
    profile: mapUserToProfile(currentUser),
    history,
    menuUser: currentUser,
  }
}
