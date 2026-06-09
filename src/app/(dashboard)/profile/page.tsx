import type { Metadata } from "next"

import { ProfilePageClient } from "@/components/features/profile/profile-page-client"
import { getProfilePageData } from "@/lib/data/profile"

export const metadata: Metadata = {
  title: "Profil",
}

export default async function ProfilePage() {
  const data = await getProfilePageData()

  return <ProfilePageClient profile={data.profile} history={data.history} />
}
