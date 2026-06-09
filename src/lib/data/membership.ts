import { desc } from "drizzle-orm"

import { db, assertDatabaseConfigured } from "@/db"
import { members } from "@/db/schema"
import type { Member, MemberStatus, MembershipTier } from "@/lib/membership/types"

export function mapMember(row: typeof members.$inferSelect): Member {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    tier: row.tier as MembershipTier,
    points: row.points,
    status: row.status as MemberStatus,
    address: row.address ?? undefined,
    avatarUrl: row.avatarUrl,
  }
}

export async function getMembers(): Promise<Member[]> {
  assertDatabaseConfigured()

  const rows = await db.select().from(members).orderBy(desc(members.points))
  return rows.map(mapMember)
}
