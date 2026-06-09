import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { InventoryProduct } from "@/lib/inventory/types"
import { cn } from "@/lib/utils"

type StatTone = "blue" | "orange" | "red" | "green" | "purple"

function toneClass(tone: StatTone) {
  const map: Record<StatTone, string> = {
    blue: "text-[#1D8AD8]",
    orange: "text-orange-600 dark:text-orange-400",
    red: "text-red-600 dark:text-red-400",
    green: "text-emerald-600 dark:text-emerald-400",
    purple: "text-violet-600 dark:text-violet-400",
  }
  return map[tone]
}

type InventoryStatsProps = {
  products: InventoryProduct[]
}

/** Ringkasan stok — mengikuti kartu “Laporan Stok Barang” di Figma */
export function InventoryStats({ products }: InventoryStatsProps) {
  const totalUnits = products.reduce((s, p) => s + p.stock, 0)
  const skus = products.length
  const availableSkus = products.filter((p) => p.stock > 0).length
  const outSkus = products.filter((p) => p.stock <= 0).length
  const active = products.filter((p) => p.isActive).length
  const inactive = products.filter((p) => !p.isActive).length

  const items: {
    title: string
    main: string
    sub: string
    tone: StatTone
  }[] = [
    {
      title: "Jumlah Stok Barang",
      main: totalUnits.toLocaleString("id-ID"),
      sub: `${skus} SKU`,
      tone: "blue",
    },
    {
      title: "Stok Tersedia",
      main: availableSkus.toLocaleString("id-ID"),
      sub: `${skus} SKU`,
      tone: "orange",
    },
    {
      title: "Stok Habis",
      main: outSkus.toLocaleString("id-ID"),
      sub: `${skus} SKU`,
      tone: "red",
    },
    {
      title: "Barang Aktif",
      main: active.toLocaleString("id-ID"),
      sub: `${skus} SKU`,
      tone: "green",
    },
    {
      title: "Barang Tidak Aktif",
      main: inactive.toLocaleString("id-ID"),
      sub: `${skus} total`,
      tone: "purple",
    },
  ]

  return (
    <div className="mb-2">
      <p className="text-muted-foreground mb-3 text-sm font-medium">
        Laporan Stok Barang
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item) => (
          <Card key={item.title} size="sm" className="shadow-xs">
            <CardHeader className="pb-1">
              <CardTitle className="text-muted-foreground text-xs font-normal">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className={cn("text-2xl font-semibold tabular-nums", toneClass(item.tone))}>
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
