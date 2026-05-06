"use client"

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
import { clearMockSessionCookie } from "@/lib/auth/client"
import { MOCK_USER_NAME } from "@/lib/dashboard/mock-data"

export function ProfileMenu() {
  const router = useRouter()

  function handleLogout() {
    clearMockSessionCookie()
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
          <BoringUserAvatar name={MOCK_USER_NAME} size={32} />
          <span className="text-primary hidden text-sm font-semibold sm:inline">
            {MOCK_USER_NAME}
          </span>
          <ChevronDownIcon className="text-muted-foreground size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="text-primary text-sm font-semibold">
              {MOCK_USER_NAME}
            </span>
            <span className="text-muted-foreground text-xs">admin@mock.local</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <UserIcon className="size-4" />
          Profil
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
