"use client"

import Image from "next/image"

import { BoringUserAvatar } from "@/components/ui/boring-avatar"
import { cn } from "@/lib/utils"

const SIZE_PX = { sm: 36, default: 80 } as const

export function MemberAvatar({
  name,
  src,
  className,
  size = "sm",
}: {
  name: string
  src?: string | null
  className?: string
  size?: "sm" | "default"
}) {
  const px = SIZE_PX[size]

  if (src) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/10",
          className
        )}
        style={{ width: px, height: px }}
      >
        <Image
          src={src}
          alt=""
          width={px}
          height={px}
          unoptimized
          className="size-full object-cover"
        />
      </span>
    )
  }

  return (
    <BoringUserAvatar
      name={name}
      size={px}
      className={cn("ring-1 ring-foreground/10", className)}
    />
  )
}
