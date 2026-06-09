"use client"

import { useRef, useState } from "react"
import { ImagePlusIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AvatarUploadProps = {
  /** URL gambar (blob: atau http) — null = hanya fallback */
  imageSrc: string | null
  fallbackLabel: string
  onImageChange: (src: string | null, fileName: string | null) => void
  className?: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

/** Pratinjau avatar lokal. */
export function AvatarUpload({
  imageSrc,
  fallbackLabel,
  onImageChange,
  className,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileLabel, setFileLabel] = useState<string | null>(null)

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Avatar className="size-28 border-2 border-border shadow-sm">
        {imageSrc ? (
          <AvatarImage src={imageSrc} alt="" className="object-cover" />
        ) : null}
        <AvatarFallback className="text-lg font-semibold">
          {initials(fallbackLabel)}
        </AvatarFallback>
      </Avatar>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) {
            onImageChange(null, null)
            setFileLabel(null)
            return
          }
          const url = URL.createObjectURL(file)
          onImageChange(url, file.name)
          setFileLabel(file.name)
        }}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-border gap-1.5"
        onClick={() => inputRef.current?.click()}
      >
        <ImagePlusIcon className="size-4" />
        Pilih gambar
      </Button>
      {fileLabel ? (
        <p className="text-muted-foreground max-w-[200px] truncate text-center text-xs">
          {fileLabel}
        </p>
      ) : (
        <p className="text-muted-foreground text-center text-xs">
          Pratinjau lokal
        </p>
      )}
    </div>
  )
}
