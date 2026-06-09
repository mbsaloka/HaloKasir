import Link from "next/link"
import { ArrowDownUpIcon } from "lucide-react"

import { BoringUserAvatar } from "@/components/ui/boring-avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MemberRow } from "@/lib/dashboard/types"

type MemberPointsCardProps = {
  members: MemberRow[]
}

export function MemberPointsCard({ members }: MemberPointsCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Poin Anggota</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground pl-6 font-medium">
                ID Anggota
              </TableHead>
              <TableHead className="text-muted-foreground pr-8 text-right font-medium">
                <span className="inline-flex items-center justify-end gap-1">
                  Poin
                  <ArrowDownUpIcon className="size-3.5 opacity-60" aria-hidden />
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <BoringUserAvatar name={m.name} size={36} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{m.name}</p>
                      <p className="text-muted-foreground text-xs">{m.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="pr-8 text-right font-medium tabular-nums">
                  {m.points.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-muted-foreground px-6 py-8 text-center"
                >
                  Belum ada anggota.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end border-t pt-4 pb-6">
        <Button
          variant="link"
          className="text-primary hover:text-primary/90 h-auto p-0 font-semibold"
          asChild
        >
          <Link href="/pelanggan">Semua Anggota &gt;</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
