"use client"

import { ImagePlusIcon } from "lucide-react"

import { MemberAvatar } from "@/components/features/membership/shared/member-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  MEMBER_STATUS_LABELS,
  MEMBERSHIP_TIER_LABELS,
  type MemberFormState,
  type MemberStatus,
  type MembershipTier,
} from "@/lib/membership/mock-data"

export type MemberFieldErrors = Partial<
  Record<keyof MemberFormState | "points", string>
>

export type MemberFormProps = {
  idPrefix: string
  form: MemberFormState
  onChange: (next: MemberFormState) => void
  errors: MemberFieldErrors
  /** Mock preview only — no file upload */
  avatarPreviewUrl?: string | null
}

export function MemberForm({
  idPrefix,
  form,
  onChange,
  errors,
  avatarPreviewUrl,
}: MemberFormProps) {
  function patch<K extends keyof MemberFormState>(
    key: K,
    value: MemberFormState[K]
  ) {
    onChange({ ...form, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-2">
          <MemberAvatar
            name={form.name || "Anggota"}
            src={avatarPreviewUrl}
            size="default"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <ImagePlusIcon className="size-4" />
            Unggah foto
          </Button>
          <p className="text-muted-foreground max-w-[200px] text-center text-xs">
            Pratinjau saja. Unggah berkas belum dihubungkan ke server.
          </p>
        </div>

        <div className="grid w-full flex-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${idPrefix}-name`}>Nama lengkap</Label>
            <Input
              id={`${idPrefix}-name`}
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              placeholder="Contoh: Dewi Lestari"
              aria-invalid={Boolean(errors.name)}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name ? (
              <p className="text-destructive text-xs">{errors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-phone`}>Nomor telepon</Label>
            <Input
              id={`${idPrefix}-phone`}
              value={form.phone}
              onChange={(e) => patch("phone", e.target.value)}
              placeholder="+62 …"
              aria-invalid={Boolean(errors.phone)}
              className={cn(errors.phone && "border-destructive")}
            />
            {errors.phone ? (
              <p className="text-destructive text-xs">{errors.phone}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-email`}>Email</Label>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              value={form.email}
              onChange={(e) => patch("email", e.target.value)}
              placeholder="nama@email.com"
              aria-invalid={Boolean(errors.email)}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email ? (
              <p className="text-destructive text-xs">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-tier`}>Jenis keanggotaan</Label>
            <Select
              value={form.tier}
              onValueChange={(v) => patch("tier", v as MembershipTier)}
            >
              <SelectTrigger
                id={`${idPrefix}-tier`}
                className="w-full"
                aria-invalid={Boolean(errors.tier)}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(MEMBERSHIP_TIER_LABELS) as MembershipTier[]).map(
                  (t) => (
                    <SelectItem key={t} value={t}>
                      {MEMBERSHIP_TIER_LABELS[t]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-points`}>Poin</Label>
            <Input
              id={`${idPrefix}-points`}
              inputMode="numeric"
              value={form.points}
              onChange={(e) => patch("points", e.target.value)}
              placeholder="0"
              aria-invalid={Boolean(errors.points)}
              className={cn(errors.points && "border-destructive")}
            />
            {errors.points ? (
              <p className="text-destructive text-xs">{errors.points}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-status`}>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => patch("status", v as MemberStatus)}
            >
              <SelectTrigger id={`${idPrefix}-status`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[]).map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {MEMBER_STATUS_LABELS[s]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${idPrefix}-address`}>
              Alamat{" "}
              <span className="text-muted-foreground font-normal">
                (opsional)
              </span>
            </Label>
            <Input
              id={`${idPrefix}-address`}
              value={form.address}
              onChange={(e) => patch("address", e.target.value)}
              placeholder="Alamat lengkap"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
