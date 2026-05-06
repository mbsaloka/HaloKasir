import type { Metadata } from "next"

import { ProfilePageClient } from "@/components/features/profile/profile-page-client"

export const metadata: Metadata = {
  title: "Profil",
}

export default function ProfilePage() {
  return <ProfilePageClient />
}
