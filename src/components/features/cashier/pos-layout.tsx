import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PosLayoutProps = {
  catalog: ReactNode
  cart: ReactNode
  className?: string
}

/** Kontainer utama POS: katalog kiri + keranjang kanan (desktop-first) */
export function PosLayout({ catalog, cart, className }: PosLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:h-[calc(100dvh-9rem)] lg:min-h-[560px] lg:flex-row lg:gap-0 lg:rounded-xl lg:border lg:border-border lg:bg-white lg:shadow-sm",
        className
      )}
    >
      {catalog}
      <div className="shrink-0 lg:border-border lg:border-l lg:pl-0">{cart}</div>
    </div>
  )
}
