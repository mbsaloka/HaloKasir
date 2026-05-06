"use client"

import { useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ProfileForm,
  type ProfileFormValues,
} from "@/components/features/profile/form/profile-form"
import { AvatarUpload } from "@/components/features/profile/shared/avatar-upload"
import type { UserProfile } from "@/lib/profile/mock-data"

export type EditProfileModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: UserProfile
  onSave: (next: UserProfile) => void
}

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onSave,
}: EditProfileModalProps) {
  const reactId = useId()
  const idPrefix = `edit-profile-${reactId.replace(/:/g, "")}`
  const prevBlobRef = useRef<string | null>(null)

  const [form, setForm] = useState<ProfileFormValues>({
    displayName: profile.displayName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
  })
  const [avatarSrc, setAvatarSrc] = useState<string | null>(profile.avatarSrc)

  useEffect(() => {
    if (!open) return
    setForm({
      displayName: profile.displayName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
    })
    setAvatarSrc(profile.avatarSrc)
    prevBlobRef.current = null
  }, [open, profile])

  function handleAvatarChange(src: string | null, _fileName: string | null) {
    if (prevBlobRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(prevBlobRef.current)
    }
    prevBlobRef.current = src
    setAvatarSrc(src)
  }

  function handleSave() {
    onSave({
      ...profile,
      displayName: form.displayName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      avatarSrc,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,640px)] gap-0 overflow-y-auto sm:max-w-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-base">Edit profil</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <AvatarUpload
            imageSrc={avatarSrc}
            fallbackLabel={form.displayName || profile.displayName}
            onImageChange={handleAvatarChange}
            className="shrink-0 sm:pt-1"
          />
          <div className="min-w-0 flex-1">
            <ProfileForm
              idPrefix={idPrefix}
              value={form}
              onChange={setForm}
              roleDisplay={profile.role}
            />
          </div>
        </div>

        <DialogFooter className="border-border mt-6 gap-2 border-t pt-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button type="button" onClick={handleSave}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
