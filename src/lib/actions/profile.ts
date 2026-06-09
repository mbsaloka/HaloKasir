"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import { accountHistory, user } from "@/db/schema"
import { mapUserToProfile } from "@/lib/data/profile"
import { requireCurrentUser } from "@/lib/data/session"
import type { UserProfile } from "@/lib/profile/types"

const profilePayloadSchema = z.object({
  displayName: z.string().trim().min(1),
  email: z.email(),
  phone: z.string().trim(),
  address: z.string().trim(),
  avatarSrc: z.string().nullable(),
})

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export async function updateProfileAction(
  payload: z.input<typeof profilePayloadSchema>
): Promise<UserProfile> {
  const currentUser = await requireCurrentUser()
  const values = profilePayloadSchema.parse(payload)

  const [updated] = await db
    .update(user)
    .set({
      name: values.displayName,
      email: values.email,
      phone: values.phone || null,
      address: values.address || null,
      image: values.avatarSrc,
      updatedAt: new Date(),
    })
    .where(eq(user.id, currentUser.id))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username,
      phone: user.phone,
      role: user.role,
      address: user.address,
    })

  if (!updated) {
    throw new Error("Profil tidak ditemukan.")
  }

  await db.insert(accountHistory).values({
    id: makeId("log"),
    userId: currentUser.id,
    router: "Profil",
    description: "Memperbarui profil pengguna",
    action: "UPDATE",
  })

  revalidatePath("/")
  revalidatePath("/profile")

  return mapUserToProfile(updated)
}
