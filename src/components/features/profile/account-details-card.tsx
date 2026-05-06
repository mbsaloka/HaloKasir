"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DateFilter } from "@/components/features/sales/date-filter"
import {
  ACCOUNT_HISTORY_PAGE_SIZES,
  type AccountHistoryAction,
  type AccountHistoryRow,
} from "@/lib/profile/mock-data"
import { cn } from "@/lib/utils"

type AccountDetailsCardProps = {
  rows: AccountHistoryRow[]
}

function actionVariant(
  action: AccountHistoryAction
): "default" | "secondary" | "destructive" | "outline" {
  switch (action) {
    case "LOG IN":
      return "secondary"
    case "CREATE":
      return "default"
    case "DELETE":
      return "destructive"
    default:
      return "outline"
  }
}

type QuickTab = "all" | "today" | "week" | "year"

function filterByQuick(rows: AccountHistoryRow[], tab: QuickTab): AccountHistoryRow[] {
  if (tab === "all") return rows
  if (tab === "today")
    return rows.filter((r) => r.at.startsWith("2024/02/04"))
  if (tab === "week")
    return rows.filter((r) => r.at.startsWith("2024/02/"))
  if (tab === "year") return rows.filter((r) => r.at.startsWith("2024/"))
  return rows
}

/** Kartu “Riwayat Akun” sesuai Figma */
export function AccountDetailsCard({ rows }: AccountDetailsCardProps) {
  const [quick, setQuick] = useState<QuickTab>("all")
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => filterByQuick(rows, quick), [rows, quick])

  useEffect(() => {
    setPage(1)
  }, [quick, pageSize])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const safePage = Math.min(page, totalPages)
  const slice = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage, pageSize])

  const pageNumbers = useMemo(() => {
    const out: number[] = []
    const window = 2
    for (let i = 1; i <= totalPages; i += 1) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - window && i <= safePage + window)
      ) {
        out.push(i)
      } else if (out[out.length - 1] !== -1) {
        out.push(-1)
      }
    }
    return out
  }, [totalPages, safePage])

  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle>Riwayat Akun</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="bg-muted/80 border-border flex flex-wrap gap-1 rounded-lg border p-1">
            {(
              [
                ["all", "Semua"],
                ["today", "Hari Ini"],
                ["week", "Minggu Ini"],
                ["year", "Tahun Ini"],
              ] as const
            ).map(([id, label]) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={quick === id ? "default" : "ghost"}
                className="h-8 px-3 text-xs sm:text-sm"
                onClick={() => setQuick(id)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
            <DateFilter labelFrom="Dari" labelTo="Sampai" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border h-9 shrink-0 gap-1 shadow-xs"
              onClick={() => {
                /* mock */
              }}
            >
              <DownloadIcon className="size-4" />
              Unduh Data
            </Button>
          </div>
        </div>

        <div className="border-border max-h-[360px] overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Tanggal</TableHead>
                <TableHead>Router</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="tabular-nums">{r.at}</TableCell>
                  <TableCell>{r.router}</TableCell>
                  <TableCell className="max-w-[280px]">{r.description}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={actionVariant(r.action)}
                      className={cn(
                        r.action === "CREATE" &&
                          "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {r.action}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-muted-foreground flex flex-col gap-3 text-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span>Baris per halaman</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="bg-background h-8 w-[72px] border-border shadow-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_HISTORY_PAGE_SIZES.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="tabular-nums">
            Halaman {safePage} dari {totalPages}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1 lg:justify-end">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            {pageNumbers.map((n, i) =>
              n === -1 ? (
                <span key={`e-${i}`} className="px-1">
                  …
                </span>
              ) : (
                <Button
                  key={n}
                  type="button"
                  variant={n === safePage ? "default" : "outline"}
                  size="sm"
                  className="size-8 min-w-8 px-0"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              )
            )}
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
