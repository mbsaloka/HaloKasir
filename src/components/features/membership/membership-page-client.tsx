"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

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
  filterMembers,
  type Member,
  type MemberTierFilter,
} from "@/lib/membership/types"
import {
  createMemberAction,
  deleteMemberAction,
  updateMemberAction,
} from "@/lib/actions/membership"

type MembershipPageClientProps = {
  initialMembers: Member[]
}

export function MembershipPageClient({
  initialMembers,
}: MembershipPageClientProps) {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>(initialMembers)
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
          Kelola pelanggan, tingkat keanggotaan, dan poin loyalitas.
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
        onSave={async ({ mode, id, values, pointsNumeric }) => {
          if (mode === "create") {
            const created = await createMemberAction({
              name: values.name.trim(),
              phone: values.phone.trim(),
              email: values.email.trim(),
              tier: values.tier,
              points: pointsNumeric,
              status: values.status,
              address: values.address.trim() || undefined,
            })
            setMembers((prev) => [created, ...prev])
            router.refresh()
            return
          }

          if (!id) return
          const updated = await updateMemberAction({
            id,
            name: values.name.trim(),
            phone: values.phone.trim(),
            email: values.email.trim(),
            tier: values.tier,
            points: pointsNumeric,
            status: values.status,
            address: values.address.trim() || undefined,
          })
          setMembers((prev) =>
            prev.map((member) => (member.id === id ? updated : member))
          )
          router.refresh()
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
                ? `Anggota "${pendingDelete.name}" akan dihapus dari database.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                if (!pendingDelete) return
                await deleteMemberAction(pendingDelete.id)
                setMembers((prev) =>
                  prev.filter((m) => m.id !== pendingDelete.id)
                )
                setPendingDelete(null)
                router.refresh()
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
