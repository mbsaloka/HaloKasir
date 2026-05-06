"use client"

import { BellIcon, MenuIcon, PanelLeftCloseIcon } from "lucide-react"

import { AppBreadcrumb } from "@/components/layout/app-breadcrumb"
import { DashboardInlineNav } from "@/components/layout/dashboard-inline-nav"
import { ProfileMenu } from "@/components/layout/profile-menu"
import { Button } from "@/components/ui/button"

type DashboardHeaderProps = {
  onMenuToggle: () => void
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="bg-background flex shrink-0 flex-col border-b border-border">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={onMenuToggle}
            aria-label="Buka menu"
          >
            <MenuIcon className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hidden md:inline-flex"
            aria-hidden
            tabIndex={-1}
          >
            <PanelLeftCloseIcon className="size-5" />
          </Button>
          <AppBreadcrumb />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label="Notifikasi"
          >
            <BellIcon className="size-5" />
          </Button>
          <ProfileMenu />
        </div>
      </div>
      {/* <DashboardInlineNav /> */}
    </header>
  )
}
