"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import { accountHistory, members } from "@/db/schema"
import { mapMember } from "@/lib/data/membership"
import { requireCurrentUser } from "@/lib/data/session"
import type { Member, MemberStatus, MembershipTier } from "@/lib/membership/types"

const memberPayloadSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.email(),
  tier: z.enum(["regular", "silver", "gold"]),
  points: z.number().int().min(0),
  status: z.enum(["active", "inactive"]),
  address: z.string().trim().optional(),
})

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

async function logMemberAction(userId: string, description: string, action: "CREATE" | "UPDATE" | "DELETE") {
  await db.insert(accountHistory).values({
    id: makeId("log"),
    userId,
    router: "Pelanggan",
    description,
    action,
  })
}

export async function createMemberAction(payload: {
  name: string
  phone: string
  email: string
  tier: MembershipTier
  points: number
  status: MemberStatus
  address?: string
}): Promise<Member> {
  const currentUser = await requireCurrentUser()
  const values = memberPayloadSchema.parse(payload)

  const [created] = await db
    .insert(members)
    .values({
      id: makeId("m"),
      name: values.name,
      phone: values.phone,
      email: values.email,
      tier: values.tier,
      points: values.points,
      status: values.status,
      address: values.address || null,
      avatarUrl: null,
    })
    .returning()

  await logMemberAction(currentUser.id, `Menambahkan anggota ${created.name}`, "CREATE")
  revalidatePath("/membership")
  revalidatePath("/")

  return mapMember(created)
}

export async function updateMemberAction(payload: {
  id: string
  name: string
  phone: string
  email: string
  tier: MembershipTier
  points: number
  status: MemberStatus
  address?: string
}): Promise<Member> {
  const currentUser = await requireCurrentUser()
  const values = memberPayloadSchema.parse(payload)

  const [updated] = await db
    .update(members)
    .set({
      name: values.name,
      phone: values.phone,
      email: values.email,
      tier: values.tier,
      points: values.points,
      status: values.status,
      address: values.address || null,
      updatedAt: new Date(),
    })
    .where(eq(members.id, payload.id))
    .returning()

  if (!updated) {
    throw new Error("Anggota tidak ditemukan.")
  }

  await logMemberAction(currentUser.id, `Memperbarui anggota ${updated.name}`, "UPDATE")
  revalidatePath("/membership")
  revalidatePath("/")

  return mapMember(updated)
}

export async function deleteMemberAction(id: string) {
  const currentUser = await requireCurrentUser()

  const [deleted] = await db
    .delete(members)
    .where(eq(members.id, id))
    .returning({ name: members.name })

  if (!deleted) {
    throw new Error("Anggota tidak ditemukan.")
  }

  await logMemberAction(currentUser.id, `Menghapus anggota ${deleted.name}`, "DELETE")
  revalidatePath("/membership")
  revalidatePath("/")
}
