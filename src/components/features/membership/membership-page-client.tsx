"use client"

import { useMemo, useState } from "react"

import { MemberModal } from "@/components/features/membership/modal/member-modal"
import { MemberStats } from "@/components/features/membership/member-stats"
import { MemberTable } from "@/components/features/membership/table/member-table"
import { MemberToolbar } from "@/components/features/membership/member-toolbar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MOCK_MEMBERS,
  filterMembers,
  type Member,
  type MemberFormState,
  type MemberTierFilter,
} from "@/lib/membership/mock-data"

function newMemberId() {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function formToMember(
  id: string,
  values: MemberFormState,
  pointsNumeric: number
): Member {
  return {
    id,
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    tier: values.tier,
    points: pointsNumeric,
    status: values.status,
    address: values.address.trim() || undefined,
    avatarUrl: null,
  }
}

export function MembershipPageClient() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS)
  const [search, setSearch] = useState("")
  const [tier, setTier] = useState<MemberTierFilter>("all")

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [modalKey, setModalKey] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<Member | null>(null)

  const filtered = useMemo(
    () => filterMembers(members, search, tier),
    [members, search, tier]
  )

  function openCreate() {
    setEditingMember(null)
    setModalMode("create")
    setModalKey((k) => k + 1)
    setModalOpen(true)
  }

  function openEdit(m: Member) {
    setEditingMember(m)
    setModalMode("edit")
    setModalKey((k) => k + 1)
    setModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
          Keanggotaan
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Kelola pelanggan, tingkat keanggotaan, dan poin loyalitas (data mock).
        </p>
      </div>

      <MemberStats members={members} />

      <Card className="overflow-hidden shadow-xs">
        <CardHeader className="border-border border-b">
          <CardTitle>Daftar anggota</CardTitle>
          <CardDescription>
            {filtered.length.toLocaleString("id-ID")} dari{" "}
            {members.length.toLocaleString("id-ID")} anggota ditampilkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <MemberToolbar
            search={search}
            onSearchChange={setSearch}
            tier={tier}
            onTierChange={setTier}
            onAddClick={openCreate}
          />
          <MemberTable
            members={filtered}
            onEdit={openEdit}
            onDelete={setPendingDelete}
          />
        </CardContent>
      </Card>

      <MemberModal
        key={modalKey}
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        member={editingMember}
        onSave={({ mode, id, values, pointsNumeric }) => {
          if (mode === "create") {
            const created = formToMember(newMemberId(), values, pointsNumeric)
            setMembers((prev) => [created, ...prev])
            return
          }
          if (!id) return
          const updated = formToMember(id, values, pointsNumeric)
          setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
          )
        }}
      />

      <AlertDialog
        open={pendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent size="default" className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus anggota?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `Anggota "${pendingDelete.name}" akan dihapus dari daftar mock. Tindakan ini hanya di antarmuka.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (!pendingDelete) return
                setMembers((prev) =>
                  prev.filter((m) => m.id !== pendingDelete.id)
                )
                setPendingDelete(null)
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
