"use client"

import BoringAvatars from "boring-avatars"

import { cn } from "@/lib/utils"

/** Palet selaras brand (primary + warna desain Halo Kasir) */
const DEFAULT_COLORS = [
  "#1D8AD8",
  "#157CBD",
  "#4EAACE",
  "#88D2DE",
  "#406787",
]

type BoringVariant =
  | "marble"
  | "beam"
  | "pixel"
  | "sunset"
  | "ring"
  | "bauhaus"
  | "geometric"
  | "abstract"

type BoringUserAvatarProps = {
  /** Dipakai untuk deterministik bentuk avatar (nama, email, id, dll.) */
  name: string
  size?: number
  className?: string
  variant?: BoringVariant
  colors?: string[]
  square?: boolean
}

/**
 * [Boring Avatars](https://boringavatars.com/) — SVG avatar deterministik dari string `name`.
 */
export function BoringUserAvatar({
  name,
  size = 40,
  className,
  variant = "beam",
  colors = DEFAULT_COLORS,
  square = false,
}: BoringUserAvatarProps) {
  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      <BoringAvatars
        name={name}
        size={size}
        variant={variant}
        colors={colors}
        square={square}
        title={false}
      />
    </span>
  )
}
