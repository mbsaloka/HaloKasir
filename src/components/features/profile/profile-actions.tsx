"use client"

import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type ProfileActionsProps = {
  onEdit: () => void
}

/** Aksi utama halaman profil (tombol edit) */
export function ProfileActions({ onEdit }: ProfileActionsProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="border-border gap-2 shadow-xs"
      onClick={onEdit}
    >
      <PencilIcon className="size-4" />
      Edit Profil
    </Button>
  )
}
