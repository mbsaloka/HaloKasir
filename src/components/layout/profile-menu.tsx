"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDownIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"

import { BoringUserAvatar } from "@/components/ui/boring-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/client"

type ProfileMenuProps = {
  user: {
    name: string
    email: string
  }
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.refresh()
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-muted/80 h-auto gap-2 rounded-lg px-2 py-1.5"
        >
          <BoringUserAvatar name={user.name} size={32} />
          <span className="text-primary hidden text-sm font-semibold sm:inline">
            {user.name}
          </span>
          <ChevronDownIcon className="text-muted-foreground size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="text-primary text-sm font-semibold">
              {user.name}
            </span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex cursor-pointer items-center gap-2">
            <UserIcon className="size-4" />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <SettingsIcon className="size-4" />
          Pengaturan akun
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="gap-2"
          onSelect={(e) => {
            e.preventDefault()
            handleLogout()
          }}
        >
          <LogOutIcon className="size-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
