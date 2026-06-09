"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { AccountDetailsCard } from "@/components/features/profile/account-details-card"
import { EditProfileModal } from "@/components/features/profile/modal/edit-profile-modal"
import { ProfileInfoCard } from "@/components/features/profile/profile-info-card"
import { updateProfileAction } from "@/lib/actions/profile"
import type { AccountHistoryRow, UserProfile } from "@/lib/profile/types"

type ProfilePageClientProps = {
  profile: UserProfile
  history: AccountHistoryRow[]
}

export function ProfilePageClient({
  profile: initialProfile,
  history,
}: ProfilePageClientProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileInfoCard profile={profile} onEdit={() => setEditOpen(true)} />
      <AccountDetailsCard rows={history} />

      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onSave={async (next) => {
          const updated = await updateProfileAction({
            displayName: next.displayName,
            email: next.email,
            phone: next.phone,
            address: next.address,
            avatarSrc: next.avatarSrc,
          })
          setProfile(updated)
          router.refresh()
        }}
      />
    </div>
  )
}
