"use client"

import { useRef } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CashierCategory } from "@/lib/cashier/mock-products"
import { CASHIER_CATEGORIES } from "@/lib/cashier/mock-products"

type CategoryFilterProps = {
  value: CashierCategory
  onChange: (c: CashierCategory) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollByDir(dir: -1 | 1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 180, behavior: "smooth" })
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="border-border shrink-0 shadow-xs"
        aria-label="Geser kategori kiri"
        onClick={() => scrollByDir(-1)}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div
        ref={scrollRef}
        className="flex flex-1 gap-2 overflow-x-auto py-0.5 [scrollbar-width:thin]"
      >
        {CASHIER_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            type="button"
            variant={value === cat ? "default" : "outline"}
            size="sm"
            className={cn(
              "shrink-0 rounded-full px-4 shadow-xs",
              value === cat && "pointer-events-none"
            )}
            onClick={() => onChange(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="border-border shrink-0 shadow-xs"
        aria-label="Geser kategori kanan"
        onClick={() => scrollByDir(1)}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )
}
