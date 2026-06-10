import { eq } from "drizzle-orm"

import { appSettings } from "@/db/schema"
import { db, assertDatabaseConfigured } from "@/db"
import {
  defaultLoyaltySettings,
  LOYALTY_SETTINGS_ID,
  type LoyaltySettings,
} from "@/lib/settings/loyalty"

function mapLoyaltySettings(
  row: typeof appSettings.$inferSelect | null | undefined
): LoyaltySettings {
  if (!row) return defaultLoyaltySettings()

  return {
    pointEarnRateBps: row.pointEarnRateBps,
    goldPointMultiplierBps: row.goldPointMultiplierBps,
  }
}

export async function getLoyaltySettings(): Promise<LoyaltySettings> {
  assertDatabaseConfigured()

  const [row] = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.id, LOYALTY_SETTINGS_ID))
    .limit(1)

  if (row) return mapLoyaltySettings(row)

  const defaults = defaultLoyaltySettings()
  const [created] = await db
    .insert(appSettings)
    .values({
      id: LOYALTY_SETTINGS_ID,
      pointEarnRateBps: defaults.pointEarnRateBps,
      goldPointMultiplierBps: defaults.goldPointMultiplierBps,
    })
    .onConflictDoNothing()
    .returning()

  if (created) return mapLoyaltySettings(created)

  const [existing] = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.id, LOYALTY_SETTINGS_ID))
    .limit(1)

  return mapLoyaltySettings(existing)
}
