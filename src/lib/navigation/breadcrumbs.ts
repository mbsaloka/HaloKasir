export type BreadcrumbSegment = {
  label: string
  href?: string
}

const ROUTES: {
  pattern: RegExp
  crumbs: (matches: RegExpMatchArray) => BreadcrumbSegment[]
}[] = [
  {
    pattern: /^\/$/,
    crumbs: () => [{ label: "Beranda" }],
  },
  {
    pattern: /^\/cashier\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Kasir" },
    ],
  },
  {
    pattern: /^\/inventory\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Persediaan" },
    ],
  },
  {
    pattern: /^\/pelanggan\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Pelanggan" },
    ],
  },
  {
    pattern: /^\/pengaturan\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Pengaturan" },
    ],
  },
  {
    pattern: /^\/sales\/report\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Penjualan", href: "/sales/report" },
      { label: "Laporan Penjualan" },
    ],
  },
  {
    pattern: /^\/sales\/transactions\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Penjualan", href: "/sales/report" },
      { label: "Transaksi" },
    ],
  },
  {
    pattern: /^\/penjualan\/laporan\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Penjualan", href: "/sales/report" },
      { label: "Laporan Penjualan" },
    ],
  },
  {
    pattern: /^\/penjualan\/transaksi\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Penjualan", href: "/sales/report" },
      { label: "Transaksi" },
    ],
  },
  {
    pattern: /^\/pembelian\/barang-masuk\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Pembelian", href: "/pembelian/barang-masuk" },
      { label: "Barang Masuk" },
    ],
  },
  {
    pattern: /^\/pembelian\/laporan\/?$/,
    crumbs: () => [
      { label: "Beranda", href: "/" },
      { label: "Pembelian", href: "/pembelian/barang-masuk" },
      { label: "Laporan Pembelian" },
    ],
  },
]

export function getDashboardBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const normalized = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1) || "/"
    : pathname

  for (const route of ROUTES) {
    const m = normalized.match(route.pattern)
    if (m) {
      return route.crumbs(m)
    }
  }

  const segments = normalized.split("/").filter(Boolean)
  if (segments.length === 0) {
    return [{ label: "Beranda" }]
  }

  const out: BreadcrumbSegment[] = [{ label: "Beranda", href: "/" }]
  let acc = ""
  segments.forEach((seg, i) => {
    acc += `/${seg}`
    const isLast = i === segments.length - 1
    const label = segmentLabel(seg)
    out.push(isLast ? { label } : { label, href: acc })
  })
  return out
}

function segmentLabel(seg: string): string {
  const map: Record<string, string> = {
    cashier: "Kasir",
    kasir: "Kasir",
    inventory: "Persediaan",
    pelanggan: "Pelanggan",
    pengaturan: "Pengaturan",
    penjualan: "Penjualan",
    pembelian: "Pembelian",
    laporan: "Laporan",
    transaksi: "Transaksi",
    "barang-masuk": "Barang Masuk",
  }
  return map[seg] ?? seg
}
