"use client"

import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { dashboardNavMain } from "@/lib/navigation/dashboard-nav"

/** Menu horizontal di navbar (desktop) — mirror submenu Penjualan & Pembelian seperti Figma */
export function DashboardInlineNav() {
  const penjualan = dashboardNavMain.find((e) => e.type === "group" && e.id === "penjualan")
  const pembelian = dashboardNavMain.find((e) => e.type === "group" && e.id === "pembelian")

  if (!penjualan || penjualan.type !== "group") return null
  if (!pembelian || pembelian.type !== "group") return null

  return (
    <nav
      className="border-border hidden items-center gap-1 border-t px-4 py-2 lg:flex"
      aria-label="Menu cepat"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-1 font-medium"
          >
            {penjualan.label}
            <ChevronDownIcon className="size-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[12rem]">
          {penjualan.children.map((c) => {
            const ItemIcon = c.icon
            return (
              <DropdownMenuItem key={c.href} asChild>
                <Link href={c.href}>
                  <ItemIcon />
                  {c.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-1 font-medium"
          >
            {pembelian.label}
            <ChevronDownIcon className="size-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[12rem]">
          {pembelian.children.map((c) => {
            const ItemIcon = c.icon
            return (
              <DropdownMenuItem key={c.href} asChild>
                <Link href={c.href}>
                  <ItemIcon />
                  {c.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
