"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProfileField } from "@/components/features/profile/shared/profile-field"
import { ProfileBadge } from "@/components/features/profile/shared/profile-badge"
import { ProfileHeader } from "@/components/features/profile/profile-header"
import type { UserProfile } from "@/lib/profile/mock-data"

type ProfileInfoCardProps = {
  profile: UserProfile
  onEdit: () => void
}

export function ProfileInfoCard({ profile, onEdit }: ProfileInfoCardProps) {
  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle>Profil</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <ProfileHeader profile={profile} onEdit={onEdit} />
          <div className="min-w-0 flex-1">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <ProfileField label="Nama" value={profile.displayName} />
              <ProfileField label="Username" value={profile.username} />
              <ProfileField
                label="Kata Sandi"
                value={profile.passwordDisplay}
              />
              <ProfileField label="Email" value={profile.email} />
              <ProfileField label="Nomor Telepon" value={profile.phone} />
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium">Peran</p>
                <ProfileBadge role={profile.role} />
              </div>
              <ProfileField
                label="Alamat"
                value={profile.address || "—"}
                className="sm:col-span-2 xl:col-span-3"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
