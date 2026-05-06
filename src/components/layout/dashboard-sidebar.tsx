"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"

import { AppLogo } from "@/components/brand/app-logo"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import {
  dashboardNavFooter,
  dashboardNavMain,
  type NavEntry,
} from "@/lib/navigation/dashboard-nav"

type DashboardSidebarProps = {
  mobileOpen: boolean
  onNavigate?: () => void
}

function NavButton({
  active,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { active?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-10 w-full justify-start gap-3 px-3 font-normal text-white hover:bg-white/10 hover:text-white",
        active && "bg-white/15 font-medium",
        className
      )}
      {...props}
    />
  )
}

function NavSection({
  entry,
  pathname,
  onNavigate,
}: {
  entry: NavEntry
  pathname: string
  onNavigate?: () => void
}) {
  if (entry.type === "link") {
    const active =
      entry.href === "/"
        ? pathname === "/"
        : pathname === entry.href || pathname.startsWith(`${entry.href}/`)
    const Icon = entry.icon
    return (
      <NavButton active={active} asChild>
        <Link href={entry.href} onClick={onNavigate}>
          <Icon className="size-5 shrink-0 opacity-90" />
          {entry.label}
        </Link>
      </NavButton>
    )
  }

  const Icon = entry.icon
  const childActive = entry.children.some(
    (c) => pathname === c.href || pathname.startsWith(`${c.href}/`)
  )

  const groupShouldOpen =
    entry.id === "penjualan"
      ? pathname.startsWith("/penjualan") || pathname.startsWith("/sales")
      : pathname.startsWith("/pembelian")

  return (
    <Collapsible defaultOpen={groupShouldOpen || childActive}>
      <CollapsibleTrigger asChild>
        <NavButton
          className="group/trigger data-[state=open]:bg-white/10"
          active={childActive}
        >
          <Icon className="size-5 shrink-0 opacity-90" />
          <span className="flex-1 text-left">{entry.label}</span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-70 transition-transform group-data-[state=open]/trigger:rotate-180" />
        </NavButton>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-none">
        <div className="border-l-border ml-3 space-y-0.5 border-l py-1 pl-3">
          {entry.children.map((child) => {
            const active = pathname === child.href
            const ChildIcon = child.icon
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white",
                  active && "bg-white/10 font-medium text-white"
                )}
              >
                <ChildIcon className="size-4 shrink-0 opacity-90" />
                {child.label}
              </Link>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function DashboardSidebar({
  mobileOpen,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname()

  const rail = (
    <>
      <div className="flex items-center gap-3 px-4 py-5">
        <AppLogo variant="icon" iconClassName="size-10" />
        <span className="text-lg font-semibold tracking-tight text-white">
          Halo Kasir
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-4">
        {dashboardNavMain.map((entry) => (
          <NavSection
            key={entry.type === "link" ? entry.href : entry.id}
            entry={entry}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 p-2">
        {dashboardNavFooter.map((entry) => (
          <NavSection
            key={entry.type === "link" ? entry.href : entry.id}
            entry={entry}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col bg-[#157CBD] text-white md:flex">
        {rail}
      </aside>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100%,280px)] flex-col bg-[#157CBD] text-white shadow-xl transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {rail}
      </div>
    </>
  )
}
