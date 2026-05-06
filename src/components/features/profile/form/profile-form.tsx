"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type ProfileFormValues = {
  displayName: string
  email: string
  phone: string
  address: string
}

type ProfileFormProps = {
  value: ProfileFormValues
  onChange: (next: ProfileFormValues) => void
  roleDisplay: string
  idPrefix: string
}

export function ProfileForm({
  value,
  onChange,
  roleDisplay,
  idPrefix,
}: ProfileFormProps) {
  function patch(partial: Partial<ProfileFormValues>) {
    onChange({ ...value, ...partial })
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-name`}>Nama</Label>
        <Input
          id={`${idPrefix}-name`}
          value={value.displayName}
          onChange={(e) => patch({ displayName: e.target.value })}
          placeholder="Nama lengkap"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={value.email}
          onChange={(e) => patch({ email: e.target.value })}
          placeholder="email@domain.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-phone`}>Nomor telepon</Label>
        <Input
          id={`${idPrefix}-phone`}
          inputMode="tel"
          value={value.phone}
          onChange={(e) => patch({ phone: e.target.value })}
          placeholder="08xxxxxxxxxx"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-address`}>Alamat (opsional)</Label>
        <Textarea
          id={`${idPrefix}-address`}
          value={value.address}
          onChange={(e) => patch({ address: e.target.value })}
          placeholder="Alamat"
          rows={3}
          className="resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-role`}>Peran</Label>
        <Input
          id={`${idPrefix}-role`}
          readOnly
          value={roleDisplay}
          className="bg-muted/50"
        />
      </div>
    </div>
  )
}
