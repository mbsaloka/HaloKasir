"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import { accountHistory, appSettings } from "@/db/schema"
import { requireCurrentUser } from "@/lib/data/session"
import {
  LOYALTY_SETTINGS_ID,
  type LoyaltySettings,
} from "@/lib/settings/loyalty"

const loyaltySettingsPayloadSchema = z.object({
  pointEarnRateBps: z.number().int().min(0).max(10000),
  goldPointMultiplierBps: z.number().int().min(10000).max(100000),
})

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export async function updateLoyaltySettingsAction(
  payload: z.input<typeof loyaltySettingsPayloadSchema>
): Promise<LoyaltySettings> {
  const currentUser = await requireCurrentUser()
  const values = loyaltySettingsPayloadSchema.parse(payload)

  const [updated] = await db
    .insert(appSettings)
    .values({
      id: LOYALTY_SETTINGS_ID,
      pointEarnRateBps: values.pointEarnRateBps,
      goldPointMultiplierBps: values.goldPointMultiplierBps,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: appSettings.id,
      set: {
        pointEarnRateBps: values.pointEarnRateBps,
        goldPointMultiplierBps: values.goldPointMultiplierBps,
        updatedAt: new Date(),
      },
    })
    .returning({
      pointEarnRateBps: appSettings.pointEarnRateBps,
      goldPointMultiplierBps: appSettings.goldPointMultiplierBps,
    })

  await db.insert(accountHistory).values({
    id: makeId("log"),
    userId: currentUser.id,
    router: "Pengaturan",
    description: "Memperbarui pengaturan poin member",
    action: "UPDATE",
  })

  revalidatePath("/pengaturan")
  revalidatePath("/cashier")
  revalidatePath("/membership")

  return updated
}
