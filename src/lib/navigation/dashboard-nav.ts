import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Home,
  Package,
  PackagePlus,
  PieChart,
  Receipt,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react"

export type NavChild = {
  href: string
  label: string
  icon: LucideIcon
}

export type NavEntry =
  | {
      type: "link"
      href: string
      label: string
      icon: LucideIcon
    }
  | {
      type: "group"
      id: string
      label: string
      icon: LucideIcon
      children: NavChild[]
    }

/** Struktur nav mengikuti Figma — grup dengan submenu seperti dropdown */
export const dashboardNavMain: NavEntry[] = [
  { type: "link", href: "/", label: "Beranda", icon: Home },
  { type: "link", href: "/cashier", label: "Kasir", icon: ShoppingCart },
  {
    type: "group",
    id: "penjualan",
    label: "Penjualan",
    icon: Store,
    children: [
      {
        href: "/sales/report",
        label: "Laporan Penjualan",
        icon: BarChart3,
      },
      { href: "/sales/transactions", label: "Transaksi", icon: Receipt },
    ],
  },
  { type: "link", href: "/inventory", label: "Persediaan", icon: Package },
  {
    type: "group",
    id: "pembelian",
    label: "Pembelian",
    icon: ShoppingBag,
    children: [
      {
        href: "/pembelian/barang-masuk",
        label: "Barang Masuk",
        icon: PackagePlus,
      },
      {
        href: "/pembelian/laporan",
        label: "Laporan Pembelian",
        icon: PieChart,
      },
    ],
  },
  { type: "link", href: "/pelanggan", label: "Pelanggan", icon: Users },
]

export const dashboardNavFooter: NavEntry[] = [
  { type: "link", href: "/pengaturan", label: "Pengaturan", icon: Settings },
]
