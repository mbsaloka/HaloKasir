"use client"

import { AwardIcon, UserCheckIcon, UsersIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Member } from "@/lib/membership/mock-data"

export function MemberStats({ members }: { members: Member[] }) {
  const active = members.filter((m) => m.status === "active").length
  const totalPoints = members.reduce((acc, m) => acc + m.points, 0)

  const items = [
    {
      title: "Total anggota",
      value: members.length.toLocaleString("id-ID"),
      icon: UsersIcon,
      hint: "Terdaftar di sistem",
    },
    {
      title: "Anggota aktif",
      value: active.toLocaleString("id-ID"),
      icon: UserCheckIcon,
      hint: "Status aktif",
    },
    {
      title: "Total poin",
      value: totalPoints.toLocaleString("id-ID"),
      icon: AwardIcon,
      hint: "Akumulasi mock",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} size="sm" className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{item.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
