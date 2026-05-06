"use client"

import { useRouter } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AuthMode = "login" | "register"

type AuthModeTabsProps = {
  mode: AuthMode
}

/** Segmented Masuk / Daftar — mirrors Figma pair; uses shadcn Tabs + App Router navigation */
export function AuthModeTabs({ mode }: AuthModeTabsProps) {
  const router = useRouter()

  return (
    <Tabs
      value={mode}
      onValueChange={(next) => {
        if (next === "login") router.push("/login")
        if (next === "register") router.push("/register")
      }}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Masuk</TabsTrigger>
        <TabsTrigger value="register">Daftar</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
