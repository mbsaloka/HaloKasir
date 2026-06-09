"use client"

import { useId, useState } from "react"

import {
  MemberForm,
  type MemberFieldErrors,
} from "@/components/features/membership/form/member-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  emptyMemberForm,
  memberToFormState,
  type Member,
  type MemberFormState,
} from "@/lib/membership/types"

export type MemberModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  member: Member | null
  onSave: (payload: {
    mode: "create" | "edit"
    id?: string
    values: MemberFormState
    pointsNumeric: number
  }) => void | Promise<void>
}

function validate(
  v: MemberFormState
): { ok: true } | { ok: false; errors: MemberFieldErrors } {
  const errors: MemberFieldErrors = {}
  if (!v.name.trim()) errors.name = "Nama wajib diisi."
  if (!v.phone.trim()) errors.phone = "Nomor telepon wajib diisi."
  if (!v.email.trim()) {
    errors.email = "Email wajib diisi."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
    errors.email = "Format email tidak valid."
  }

  const rawPoints = String(v.points).replace(/\D/g, "")
  const pointsNumeric = rawPoints === "" ? NaN : Number(rawPoints)
  if (Number.isNaN(pointsNumeric) || pointsNumeric < 0) {
    errors.points = "Poin tidak valid."
  }

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true }
}

export function MemberModal({
  open,
  onOpenChange,
  mode,
  member,
  onSave,
}: MemberModalProps) {
  const reactId = useId()
  const idPrefix = `member-form-${reactId.replace(/:/g, "")}`

  const [form, setForm] = useState<MemberFormState>(() =>
    mode === "edit" && member ? memberToFormState(member) : emptyMemberForm()
  )
  const [errors, setErrors] = useState<MemberFieldErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = validate(form)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    const rawPoints = String(form.points).replace(/\D/g, "")
    const pointsNumeric = Number(rawPoints)
    setIsSaving(true)
    try {
      await onSave({
        mode,
        id: member?.id,
        values: form,
        pointsNumeric,
      })
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  const title =
    mode === "create" ? "Tambah anggota" : "Ubah data anggota"
  const description =
    mode === "create"
      ? "Lengkapi data pelanggan untuk mendaftarkan keanggotaan."
      : "Perbarui informasi anggota di database."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90vh,720px)] gap-0 overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader className="border-border shrink-0 border-b pb-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
          <MemberForm
            idPrefix={idPrefix}
            form={form}
            onChange={setForm}
            errors={errors}
            avatarPreviewUrl={mode === "edit" ? member?.avatarUrl : null}
          />

          <DialogFooter className="border-border shrink-0 border-t pt-4 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="min-w-[120px] bg-[#157CBD] hover:bg-[#126BA8]"
            >
              {isSaving
                ? "Menyimpan..."
                : mode === "create"
                  ? "Simpan"
                  : "Perbarui"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
