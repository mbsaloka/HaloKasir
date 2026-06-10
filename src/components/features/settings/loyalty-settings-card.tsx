"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { SaveIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateLoyaltySettingsAction } from "@/lib/actions/settings"
import { calculateEarnedMemberPoints } from "@/lib/settings/loyalty"
import type { LoyaltySettings } from "@/lib/settings/loyalty"

type LoyaltySettingsCardProps = {
  settings: LoyaltySettings
}

function formatDecimalInput(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "")
}

function formatPercentInput(bps: number) {
  return formatDecimalInput(bps / 100)
}

function formatMultiplierInput(bps: number) {
  return formatDecimalInput(bps / 10000)
}

function parseDecimalInput(value: string) {
  const normalized = value.trim().replace(",", ".")
  if (!normalized) return NaN

  return Number(normalized)
}

function toPointEarnRateBps(value: string) {
  const percent = parseDecimalInput(value)
  if (!Number.isFinite(percent)) return NaN

  return Math.round(percent * 100)
}

function toGoldMultiplierBps(value: string) {
  const multiplier = parseDecimalInput(value)
  if (!Number.isFinite(multiplier)) return NaN

  return Math.round(multiplier * 10000)
}

export function LoyaltySettingsCard({
  settings: initialSettings,
}: LoyaltySettingsCardProps) {
  const router = useRouter()
  const [settings, setSettings] = useState(initialSettings)
  const [pointRate, setPointRate] = useState(
    formatPercentInput(initialSettings.pointEarnRateBps)
  )
  const [goldMultiplier, setGoldMultiplier] = useState(
    formatMultiplierInput(initialSettings.goldPointMultiplierBps)
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const draft = useMemo(() => {
    const pointEarnRateBps = toPointEarnRateBps(pointRate)
    const goldPointMultiplierBps = toGoldMultiplierBps(goldMultiplier)

    return {
      pointEarnRateBps: Number.isNaN(pointEarnRateBps)
        ? settings.pointEarnRateBps
        : pointEarnRateBps,
      goldPointMultiplierBps: Number.isNaN(goldPointMultiplierBps)
        ? settings.goldPointMultiplierBps
        : goldPointMultiplierBps,
    }
  }, [goldMultiplier, pointRate, settings])

  const regularPreview = calculateEarnedMemberPoints({
    amount: 100_000,
    tier: "regular",
    settings: draft,
  })
  const goldPreview = calculateEarnedMemberPoints({
    amount: 100_000,
    tier: "gold",
    settings: draft,
  })

  async function handleSave() {
    const pointEarnRateBps = toPointEarnRateBps(pointRate)
    const goldPointMultiplierBps = toGoldMultiplierBps(goldMultiplier)

    if (
      Number.isNaN(pointEarnRateBps) ||
      pointEarnRateBps < 0 ||
      pointEarnRateBps > 10000
    ) {
      setError("Persentase poin harus berada di antara 0% dan 100%.")
      setSuccess(null)
      return
    }

    if (
      Number.isNaN(goldPointMultiplierBps) ||
      goldPointMultiplierBps < 10000 ||
      goldPointMultiplierBps > 100000
    ) {
      setError("Multiplier Gold harus berada di antara 1x dan 10x.")
      setSuccess(null)
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const updated = await updateLoyaltySettingsAction({
        pointEarnRateBps,
        goldPointMultiplierBps,
      })
      setSettings(updated)
      setPointRate(formatPercentInput(updated.pointEarnRateBps))
      setGoldMultiplier(formatMultiplierInput(updated.goldPointMultiplierBps))
      setSuccess("Pengaturan poin tersimpan.")
      router.refresh()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Gagal menyimpan pengaturan poin."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="shadow-xs">
      <CardHeader className="border-border border-b">
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="text-primary size-4" />
          Poin Member
        </CardTitle>
        <CardDescription>
          Poin dihitung dari total akhir transaksi dan dibulatkan ke atas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="point-rate">Poin per transaksi</Label>
            <div className="border-input bg-background flex h-10 items-center rounded-md border px-3 shadow-xs">
              <Input
                id="point-rate"
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                step="0.01"
                value={pointRate}
                onChange={(event) => setPointRate(event.target.value)}
                className="h-auto border-0 px-0 text-right shadow-none focus-visible:ring-0"
              />
              <span className="text-muted-foreground pl-2 text-sm font-medium">
                %
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Default 1%. Nilai 1 berarti transaksi Rp 100.000 memberi 1.000
              poin.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gold-multiplier">Multiplier member Gold</Label>
            <div className="border-input bg-background flex h-10 items-center rounded-md border px-3 shadow-xs">
              <Input
                id="gold-multiplier"
                type="number"
                inputMode="decimal"
                min="1"
                max="10"
                step="0.01"
                value={goldMultiplier}
                onChange={(event) => setGoldMultiplier(event.target.value)}
                className="h-auto border-0 px-0 text-right shadow-none focus-visible:ring-0"
              />
              <span className="text-muted-foreground pl-2 text-sm font-medium">
                x
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Default 1.5x. Member Regular dan Silver tetap memakai 1x.
            </p>
          </div>
        </div>

        <div className="bg-muted/40 grid gap-3 rounded-lg border border-border p-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs">Contoh Regular</p>
            <p className="font-semibold tabular-nums">
              {regularPreview.toLocaleString("id-ID")} poin
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Contoh Gold</p>
            <p className="font-semibold tabular-nums">
              {goldPreview.toLocaleString("id-ID")} poin
            </p>
          </div>
        </div>

        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        {success ? <p className="text-emerald-700 text-sm">{success}</p> : null}

        <div className="flex justify-end">
          <Button
            type="button"
            className="min-w-32"
            disabled={isSaving}
            onClick={handleSave}
          >
            <SaveIcon className="size-4" />
            {isSaving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
