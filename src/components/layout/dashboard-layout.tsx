import type { ReactNode } from "react"

import { DashboardShell } from "@/components/layout/dashboard-shell"

type DashboardLayoutProps = {
  children: ReactNode
  user: {
    name: string
    email: string
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return <DashboardShell user={user}>{children}</DashboardShell>
}
