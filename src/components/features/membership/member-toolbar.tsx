"use client"

import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MEMBERSHIP_TIER_LABELS,
  type MemberTierFilter,
  type MembershipTier,
} from "@/lib/membership/types"

export type MemberToolbarProps = {
  search: string
  onSearchChange: (v: string) => void
  tier: MemberTierFilter
  onTierChange: (v: MemberTierFilter) => void
  onAddClick: () => void
}

export function MemberToolbar({
  search,
  onSearchChange,
  tier,
  onTierChange,
  onAddClick,
}: MemberToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama, telepon, atau email…"
            className="h-10 pl-9"
            aria-label="Cari anggota"
          />
        </div>
        <Select
          value={tier}
          onValueChange={(v) => onTierChange(v as MemberTierFilter)}
        >
          <SelectTrigger className="h-10 w-full sm:w-[200px]">
            <SelectValue placeholder="Tingkat keanggotaan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua tingkat</SelectItem>
            {(Object.keys(MEMBERSHIP_TIER_LABELS) as MembershipTier[]).map(
              (t) => (
                <SelectItem key={t} value={t}>
                  {MEMBERSHIP_TIER_LABELS[t]}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        className="h-10 shrink-0 gap-2 bg-[#157CBD] hover:bg-[#126BA8]"
        onClick={onAddClick}
      >
        <PlusIcon className="size-4" />
        Tambah anggota
      </Button>
    </div>
  )
}
