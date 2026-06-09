import type { Metadata } from "next"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { requireCurrentUser } from "@/lib/data/session"

export const metadata: Metadata = {
  title: {
    default: "Beranda",
    template: "%s · Halo Kasir",
  },
}

export const dynamic = "force-dynamic"

export default async function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireCurrentUser()

  return (
    <DashboardLayout
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </DashboardLayout>
  )
}
