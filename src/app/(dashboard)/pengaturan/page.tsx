import type { Metadata } from "next"

import { LoyaltySettingsCard } from "@/components/features/settings/loyalty-settings-card"
import { getLoyaltySettings } from "@/lib/data/settings"

export const metadata: Metadata = {
  title: "Pengaturan",
}

export default async function PengaturanPage() {
  const loyaltySettings = await getLoyaltySettings()

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
          Pengaturan
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Atur perhitungan poin member untuk transaksi kasir.
        </p>
      </div>

      <LoyaltySettingsCard settings={loyaltySettings} />
    </div>
  )
}
