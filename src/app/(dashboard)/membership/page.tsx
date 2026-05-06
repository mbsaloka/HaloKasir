import type { Metadata } from "next"

import { MembershipPageClient } from "@/components/features/membership/membership-page-client"

export const metadata: Metadata = {
  title: "Keanggotaan",
}

export default function MembershipPage() {
  return <MembershipPageClient />
}
