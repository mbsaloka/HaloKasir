import type { ReactNode } from "react"

import { AppLogo } from "@/components/brand/app-logo"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  children: ReactNode
  className?: string
}

/**
 * Desktop-first split shell: brand panel + form column (Figma auth frames).
 * Children should include mode tabs, header, form, legal, and cross-links.
 */
export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div
      className={cn(
        "auth-root bg-background text-foreground flex min-h-dvh flex-col items-center justify-center px-6 py-10 sm:px-10",
        className
      )}
    >
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:max-w-6xl xl:gap-16">
        <aside className="flex justify-center">
          <AppLogo
            variant="full"
            className="max-h-[min(280px,40vh)] w-auto lg:max-h-[min(320px,50vh)]"
          />
        </aside>
        <main className="flex w-full justify-center">
          <div className="w-full max-w-md space-y-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
