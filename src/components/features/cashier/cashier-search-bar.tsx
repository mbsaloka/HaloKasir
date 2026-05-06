"use client"

import { ArrowDownUpIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SortMode = "name" | "price"

type CashierSearchBarProps = {
  query: string
  onQueryChange: (q: string) => void
  sortMode: SortMode
  onSortToggle: () => void
}

export function CashierSearchBar({
  query,
  onQueryChange,
  sortMode,
  onSortToggle,
}: CashierSearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="border-border shrink-0 shadow-xs"
        aria-label={`Urutkan: ${sortMode === "name" ? "nama" : "harga"}`}
        title="Urutkan"
        onClick={onSortToggle}
      >
        <ArrowDownUpIcon className="size-4" />
      </Button>
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari item"
          className={cn("h-10 border-border bg-white pr-3 pl-10 shadow-xs")}
        />
      </div>
    </div>
  )
}

export type { SortMode }
