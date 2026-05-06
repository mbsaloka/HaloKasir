"use client"

import { useState } from "react"

import { AccountDetailsCard } from "@/components/features/profile/account-details-card"
import { EditProfileModal } from "@/components/features/profile/modal/edit-profile-modal"
import { ProfileInfoCard } from "@/components/features/profile/profile-info-card"
import {
  MOCK_ACCOUNT_HISTORY,
  MOCK_USER_PROFILE,
  type UserProfile,
} from "@/lib/profile/mock-data"

export function ProfilePageClient() {
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER_PROFILE)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileInfoCard profile={profile} onEdit={() => setEditOpen(true)} />
      <AccountDetailsCard rows={MOCK_ACCOUNT_HISTORY} />

      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onSave={setProfile}
      />
    </div>
  )
}
