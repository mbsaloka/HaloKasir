import type { MembershipTier } from "@/lib/membership/types"

export const LOYALTY_SETTINGS_ID = "loyalty"
export const DEFAULT_POINT_EARN_RATE_BPS = 100
export const DEFAULT_GOLD_POINT_MULTIPLIER_BPS = 15000

export type LoyaltySettings = {
  pointEarnRateBps: number
  goldPointMultiplierBps: number
}

export function defaultLoyaltySettings(): LoyaltySettings {
  return {
    pointEarnRateBps: DEFAULT_POINT_EARN_RATE_BPS,
    goldPointMultiplierBps: DEFAULT_GOLD_POINT_MULTIPLIER_BPS,
  }
}

export function multiplierBpsForTier(
  tier: MembershipTier,
  settings: LoyaltySettings
) {
  return tier === "gold" ? settings.goldPointMultiplierBps : 10000
}

export function calculateEarnedMemberPoints({
  amount,
  tier,
  settings,
}: {
  amount: number
  tier: MembershipTier
  settings: LoyaltySettings
}) {
  if (amount <= 0 || settings.pointEarnRateBps <= 0) return 0

  const multiplierBps = multiplierBpsForTier(tier, settings)
  return Math.ceil(
    (amount * settings.pointEarnRateBps * multiplierBps) / 100_000_000
  )
}
