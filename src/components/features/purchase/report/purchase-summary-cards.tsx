import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatRupiah } from "@/lib/cashier/format-rupiah"
import {
  totalUnitsInRecords,
  type IncomingGoodsRecord,
} from "@/lib/purchase/mock-data"
import { cn } from "@/lib/utils"

type Tone = "blue" | "slate" | "orange" | "violet" | "emerald"

function toneClass(tone: Tone) {
  const map: Record<Tone, string> = {
    blue: "text-[#1D8AD8]",
    slate: "text-slate-700 dark:text-slate-200",
    orange: "text-orange-600 dark:text-orange-400",
    violet: "text-violet-600 dark:text-violet-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  }
  return map[tone]
}

type PurchaseSummaryCardsProps = {
  records: IncomingGoodsRecord[]
}

export function PurchaseSummaryCards({ records }: PurchaseSummaryCardsProps) {
  const totalUnits = totalUnitsInRecords(records)
  const txCount = records.length
  const totalNominal = records.reduce((s, r) => s + r.grandTotal, 0)
  const thisMonth = records.filter((r) => r.purchasedAt.startsWith("2024/02"))
  const monthNominal = thisMonth.reduce((s, r) => s + r.grandTotal, 0)
  const uniqueSuppliers = new Set(records.map((r) => r.supplier)).size
  const avg = txCount > 0 ? Math.round(totalNominal / txCount) : 0

  const items: {
    title: string
    main: string
    sub: string
    tone: Tone
  }[] = [
    {
      title: "Jumlah Pembelian",
      main: totalUnits.toLocaleString("id-ID"),
      sub: `${txCount} transaksi`,
      tone: "blue",
    },
    {
      title: "Total nilai pembelian",
      main: formatRupiah(totalNominal),
      sub: "Semua periode data mock",
      tone: "slate",
    },
    {
      title: "Pembelian bulan ini",
      main: formatRupiah(monthNominal),
      sub: "Feb 2024 (mock)",
      tone: "orange",
    },
    {
      title: "Supplier aktif",
      main: uniqueSuppliers.toLocaleString("id-ID"),
      sub: "Pemasok unik",
      tone: "violet",
    },
    {
      title: "Rata-rata per transaksi",
      main: formatRupiah(avg),
      sub: "Nilai rata-rata",
      tone: "emerald",
    },
  ]

  return (
    <div className="space-y-3">
      <h1 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
        Laporan Pembelian
      </h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item) => (
          <Card key={item.title} size="sm" className="shadow-xs">
            <CardHeader className="pb-1">
              <CardTitle className="text-muted-foreground text-xs font-normal">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p
                className={cn(
                  "text-lg font-semibold tabular-nums sm:text-xl",
                  toneClass(item.tone)
                )}
              >
                {item.main}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
