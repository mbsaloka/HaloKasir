/** Mock modul Pembelian — tanpa backend */

export type PurchaseLine = {
  id: string
  barcode: string
  productName: string
  unitPrice: number
  qty: number
  expiry: string
}

export type PurchaseIncomingStatus = "Received" | "Pending" | "Cancelled"

export type IncomingGoodsRecord = {
  id: string
  invoiceNo: string
  supplier: string
  purchasedAt: string
  status: PurchaseIncomingStatus
  lines: PurchaseLine[]
  grandTotal: number
}

export const MOCK_PURCHASE_INVOICE_DRAFT = "KPTH2601290001"

export const MOCK_SUPPLIERS = [
  "PT Indomie Makmur Jaya",
  "PT Indomie Jaya Perkasa",
  "PT Wings Surya",
  "PT Unilever Indonesia Tbk",
  "PT Coca-Cola Indonesia",
] as const

const line = (
  id: string,
  barcode: string,
  name: string,
  price: number,
  qty: number,
  expiry: string
): PurchaseLine => ({
  id,
  barcode,
  productName: name,
  unitPrice: price,
  qty,
  expiry,
})

function buildRecords(): IncomingGoodsRecord[] {
  return [
    {
      id: "inc-1",
      invoiceNo: "PMB2402010001",
      supplier: "PT Indomie Jaya Perkasa",
      purchasedAt: "2024/02/01 10:15:22",
      status: "Received",
      grandTotal: 13_500_000,
      lines: [
        line("l1", "8991234567890", "Indomie Goreng", 3500, 2000, "30/12/2026"),
        line("l2", "8991234567891", "Indomie Goreng Spesial", 3800, 1500, "15/11/2026"),
      ],
    },
    {
      id: "inc-2",
      invoiceNo: "PMB2402040088",
      supplier: "PT Wings Surya",
      purchasedAt: "2024/02/04 14:22:01",
      status: "Pending",
      grandTotal: 4_250_000,
      lines: [
        line("l3", "8961234001001", "Mie Sedaap Goreng", 3200, 800, "01/08/2026"),
      ],
    },
    {
      id: "inc-3",
      invoiceNo: "PMB2402100150",
      supplier: "PT Unilever Indonesia Tbk",
      purchasedAt: "2024/02/10 09:00:00",
      status: "Received",
      grandTotal: 8_900_000,
      lines: [
        line("l4", "8999991112222", "Royco Ayam", 2500, 3000, "20/05/2027"),
        line("l5", "8999991112223", "Royco Sapi", 2500, 2000, "20/05/2027"),
      ],
    },
    {
      id: "inc-4",
      invoiceNo: "PMB2402150200",
      supplier: "PT Coca-Cola Indonesia",
      purchasedAt: "2024/02/15 16:45:33",
      status: "Cancelled",
      grandTotal: 1_200_000,
      lines: [
        line("l6", "1234567890123", "Fanta 390ml", 6000, 200, "10/03/2026"),
      ],
    },
    {
      id: "inc-5",
      invoiceNo: "PMB2402200221",
      supplier: "PT Indomie Makmur Jaya",
      purchasedAt: "2024/02/20 11:30:00",
      status: "Received",
      grandTotal: 22_100_000,
      lines: [
        line("l7", "8991234000001", "Indomie Ayam Bawang", 3500, 4000, "30/01/2027"),
        line("l8", "8991234000002", "Indomie Kari Ayam", 3500, 3500, "28/02/2027"),
      ],
    },
  ]
}

export const MOCK_INCOMING_GOODS: IncomingGoodsRecord[] = buildRecords()

export type PurchaseTrendPoint = {
  month: string
  amount: number
}

export const MOCK_PURCHASE_TREND: PurchaseTrendPoint[] = [
  { month: "Sep", amount: 42_000_000 },
  { month: "Okt", amount: 38_500_000 },
  { month: "Nov", amount: 51_200_000 },
  { month: "Des", amount: 47_800_000 },
  { month: "Jan", amount: 55_100_000 },
  { month: "Feb", amount: 49_300_000 },
]

export type SupplierSpend = {
  supplier: string
  amount: number
}

export const MOCK_SUPPLIER_SPEND: SupplierSpend[] = [
  { supplier: "Indomie", amount: 28_500_000 },
  { supplier: "Wings", amount: 14_200_000 },
  { supplier: "Unilever", amount: 12_400_000 },
  { supplier: "Coca-Cola", amount: 9_100_000 },
  { supplier: "Lainnya", amount: 6_800_000 },
]

export const PURCHASE_REPORT_PAGE_SIZE = 8

export function incomingRecordsToReportRows(
  records: IncomingGoodsRecord[]
): IncomingGoodsRecord[] {
  return [...records].sort(
    (a, b) =>
      new Date(b.purchasedAt.replace(/\//g, "-")).getTime() -
      new Date(a.purchasedAt.replace(/\//g, "-")).getTime()
  )
}

export function filterIncomingRecords(
  records: IncomingGoodsRecord[],
  status: string,
  search: string
): IncomingGoodsRecord[] {
  const q = search.trim().toLowerCase()
  return records.filter((r) => {
    if (status !== "Semua" && r.status !== status) return false
    if (!q) return true
    return (
      r.invoiceNo.toLowerCase().includes(q) ||
      r.supplier.toLowerCase().includes(q)
    )
  })
}

export function filterReportRecords(
  records: IncomingGoodsRecord[],
  search: string,
  period: string
): IncomingGoodsRecord[] {
  const q = search.trim().toLowerCase()
  let list = records
  if (period === "Bulan ini") {
    list = list.filter((r) => r.purchasedAt.startsWith("2024/02"))
  } else if (period === "Tahun ini") {
    list = list.filter((r) => r.purchasedAt.startsWith("2024"))
  }
  if (!q) return list
  return list.filter(
    (r) =>
      r.invoiceNo.toLowerCase().includes(q) ||
      r.supplier.toLowerCase().includes(q)
  )
}

export function totalUnitsInRecords(records: IncomingGoodsRecord[]): number {
  return records.reduce(
    (s, r) => s + r.lines.reduce((ls, l) => ls + l.qty, 0),
    0
  )
}
