import type { Metadata } from "next"

import { MembershipPageClient } from "@/components/features/membership/membership-page-client"
import { getMembers } from "@/lib/data/membership"

export const metadata: Metadata = {
  title: "Keanggotaan",
}

export default async function MembershipPage() {
  const members = await getMembers()

  return <MembershipPageClient initialMembers={members} />
}
