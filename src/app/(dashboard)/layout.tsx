import type { Metadata } from "next"

import { DashboardLayout } from "@/components/layout/dashboard-layout"

export const metadata: Metadata = {
  title: {
    default: "Beranda",
    template: "%s · Halo Kasir",
  },
}

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
