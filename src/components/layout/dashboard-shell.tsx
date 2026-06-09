"use client"

import { useEffect, useState, type ReactNode } from "react"

import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { cn } from "@/lib/utils"

type DashboardShellProps = {
  children: ReactNode
  user: {
    name: string
    email: string
  }
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    function closeIfDesktop() {
      if (mq.matches) setMobileOpen(false)
    }
    mq.addEventListener("change", closeIfDesktop)
    return () => mq.removeEventListener("change", closeIfDesktop)
  }, [])

  return (
    <div className="bg-muted/30 flex min-h-dvh">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <DashboardHeader
          user={user}
          onMenuToggle={() => setMobileOpen((o) => !o)}
        />
        <main
          className={cn(
            "flex-1 overflow-auto px-4 py-6 md:px-6 lg:px-8",
            "bg-[oklch(0.97_0.01_252)]"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
