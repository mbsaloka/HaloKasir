"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileActions } from "@/components/features/profile/profile-actions"
import type { UserProfile } from "@/lib/profile/types"

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

type ProfileHeaderProps = {
  profile: UserProfile
  onEdit: () => void
}

/** Kolom kiri: foto profil + aksi edit (sesuai Figma) */
export function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 lg:items-start">
      <Avatar className="border-border size-32 border-2 shadow-sm">
        {profile.avatarSrc ? (
          <AvatarImage src={profile.avatarSrc} alt="" className="object-cover" />
        ) : null}
        <AvatarFallback className="text-2xl font-semibold">
          {initials(profile.displayName)}
        </AvatarFallback>
      </Avatar>
      <ProfileActions onEdit={onEdit} />
    </div>
  )
}
