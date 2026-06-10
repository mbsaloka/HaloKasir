"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  SearchIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react"

import { MembershipBadge } from "@/components/features/membership/shared/membership-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatRupiah } from "@/lib/cashier/format-rupiah"
import { cn } from "@/lib/utils"
import type { Member } from "@/lib/membership/types"

type MemberPointSelectorProps = {
  members: Member[]
  selectedMember: Member | null
  pointInput: string
  pointDiscount: number
  maxPointDiscount: number
  onSelectMember: (memberId: string | null) => void
  onPointInputChange: (value: string) => void
  onUseAllPoints: () => void
  onUseFullTotal: () => void
  onClearPoints: () => void
}

function matchesMember(member: Member, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return (
    member.name.toLowerCase().includes(q) ||
    member.phone.toLowerCase().includes(q) ||
    member.email.toLowerCase().includes(q)
  )
}

function MemberOption({
  member,
  selected,
  onSelect,
}: {
  member: Member
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted",
        selected && "bg-primary/10 text-primary"
      )}
      onClick={onSelect}
    >
      <span className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
        <UserRoundIcon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{member.name}</span>
        <span className="text-muted-foreground block truncate text-xs">
          {member.phone} - {member.points.toLocaleString("id-ID")} poin
        </span>
      </span>
      <MembershipBadge tier={member.tier} className="hidden sm:inline-flex" />
      {selected ? <CheckIcon className="size-4 shrink-0" /> : null}
    </button>
  )
}

export function MemberPointSelector({
  members,
  selectedMember,
  pointInput,
  pointDiscount,
  maxPointDiscount,
  onSelectMember,
  onPointInputChange,
  onUseAllPoints,
  onUseFullTotal,
  onClearPoints,
}: MemberPointSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)

  const filteredMembers = useMemo(
    () => members.filter((member) => matchesMember(member, query)),
    [members, query]
  )

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!rootRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [open])

  function selectMember(memberId: string | null) {
    onSelectMember(memberId)
    setOpen(false)
  }

  function toggleOpen() {
    if (open) {
      setOpen(false)
      return
    }

    setQuery("")
    setOpen(true)
  }

  return (
    <div className="space-y-3">
      <div ref={rootRef} className="relative space-y-2">
        <p className="text-muted-foreground text-xs font-medium">Member</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-border h-11 min-w-0 flex-1 justify-between gap-2 bg-background px-3 text-left font-normal shadow-xs"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={toggleOpen}
          >
            <span className="flex min-w-0 items-center gap-2">
              <UserRoundIcon className="text-muted-foreground size-4 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate text-sm">
                  {selectedMember ? selectedMember.name : "Pilih member"}
                </span>
                <span className="text-muted-foreground block truncate text-xs">
                  {selectedMember
                    ? `${selectedMember.points.toLocaleString("id-ID")} poin`
                    : "Cari berdasarkan nama"}
                </span>
              </span>
            </span>
            <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
          </Button>

          {selectedMember ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="border-border h-11 w-11 bg-background shadow-xs"
              aria-label="Hapus member"
              onClick={() => selectMember(null)}
            >
              <XIcon className="size-4" />
            </Button>
          ) : null}
        </div>

        {open ? (
          <div className="absolute right-0 bottom-full z-50 mb-2 w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
            <div className="border-border border-b p-2">
              <div className="relative">
                <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nama member"
                  className="h-9 pl-9"
                  aria-label="Cari member"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setOpen(false)
                  }}
                />
              </div>
            </div>

            <div role="listbox" className="max-h-64 overflow-y-auto p-1">
              <button
                type="button"
                role="option"
                aria-selected={selectedMember == null}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted",
                  selectedMember == null && "bg-primary/10 text-primary"
                )}
                onClick={() => selectMember(null)}
              >
                <span className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
                  <UserRoundIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    Pelanggan umum
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    Tanpa penggunaan poin
                  </span>
                </span>
                {selectedMember == null ? (
                  <CheckIcon className="size-4 shrink-0" />
                ) : null}
              </button>

              {filteredMembers.map((member) => (
                <MemberOption
                  key={member.id}
                  member={member}
                  selected={selectedMember?.id === member.id}
                  onSelect={() => selectMember(member.id)}
                />
              ))}

              {filteredMembers.length === 0 ? (
                <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                  Member tidak ditemukan.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {selectedMember ? (
        <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {selectedMember.points.toLocaleString("id-ID")} poin tersedia
              </p>
              <p className="text-muted-foreground text-xs">
                Maksimal digunakan {formatRupiah(maxPointDiscount)}.
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs">Potongan</p>
              <p className="text-emerald-700 text-sm font-semibold tabular-nums">
                {formatRupiah(pointDiscount)}
              </p>
            </div>
          </div>

          <div className="border-input bg-background flex h-10 items-center rounded-md border px-3 shadow-xs">
            <span className="text-muted-foreground pr-2 text-sm font-semibold">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={pointInput}
              onChange={(event) => onPointInputChange(event.target.value)}
              placeholder="0"
              className="placeholder:text-muted-foreground/60 min-w-0 flex-1 border-0 bg-transparent text-right text-sm font-semibold tabular-nums outline-none"
              aria-label="Poin yang digunakan"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="bg-background"
              disabled={maxPointDiscount <= 0}
              onClick={onUseAllPoints}
            >
              All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="bg-background"
              disabled={maxPointDiscount <= 0}
              onClick={onUseFullTotal}
            >
              100%
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="bg-background"
              onClick={onClearPoints}
            >
              0
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
