"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDashboardBreadcrumbs } from "@/lib/navigation/breadcrumbs"

export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = getDashboardBreadcrumbs(pathname)

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1
          return (
            <span key={`${seg.label}-${i}`} className="contents">
              {i > 0 && (
                <BreadcrumbSeparator className="text-muted-foreground/70 [&>svg]:size-3.5" />
              )}
              <BreadcrumbItem>
                {isLast || !seg.href ? (
                  <BreadcrumbPage className="truncate text-sm font-medium">
                    {seg.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={seg.href} className="truncate text-sm">
                      {seg.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
