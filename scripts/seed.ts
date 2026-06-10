import "dotenv/config"

import { eq } from "drizzle-orm"

import { assertDatabaseConfigured, db } from "../src/db"
import {
  account,
  accountHistory,
  appSettings,
  members,
  products,
  purchaseLines,
  purchaseRecords,
  salesTransactionItems,
  salesTransactions,
  session,
  suppliers,
  user,
  verification,
} from "../src/db/schema"
import { auth } from "../src/lib/auth"
import {
  calculateEarnedMemberPoints,
  defaultLoyaltySettings,
  LOYALTY_SETTINGS_ID,
} from "../src/lib/settings/loyalty"
import type { MembershipTier } from "../src/lib/membership/types"

assertDatabaseConfigured()

type ProductSeed = typeof products.$inferInsert
type SupplierSeed = typeof suppliers.$inferInsert
type MemberSeed = typeof members.$inferInsert

// Keep demo timestamps deterministic and away from the real current day.
// This still gives the dashboard data for this week/month/year in the sample set.
const seedReferenceDate = new Date(2026, 5, 9)

function dateDaysAgo(days: number, hour = 10, minute = 0) {
  const date = new Date(seedReferenceDate)
  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, 0, 0)
  return date
}

function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function makeId(prefix: string, index: number) {
  return `${prefix}-${String(index).padStart(3, "0")}`
}

function expiry(monthsFromNow: number) {
  const date = addMonths(seedReferenceDate, monthsFromNow)
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
}

async function resetDatabase() {
  await db.delete(accountHistory)
  await db.delete(appSettings)
  await db.delete(purchaseLines)
  await db.delete(purchaseRecords)
  await db.delete(salesTransactionItems)
  await db.delete(salesTransactions)
  await db.delete(products)
  await db.delete(suppliers)
  await db.delete(members)
  await db.delete(verification)
  await db.delete(account)
  await db.delete(session)
  await db.delete(user)
}

async function createAuthUser(input: {
  name: string
  email: string
  password: string
  username: string
  phone: string
  role: string
  address: string
}) {
  const result = await auth.api.signUpEmail({
    body: {
      name: input.name,
      email: input.email,
      password: input.password,
    },
  })

  if (!result.user) {
    throw new Error(`Gagal membuat user ${input.email}`)
  }

  const [updated] = await db
    .update(user)
    .set({
      username: input.username,
      phone: input.phone,
      role: input.role,
      address: input.address,
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(user.id, result.user.id))
    .returning()

  return updated
}

const productSeeds: ProductSeed[] = [
  {
    id: "prd-indomie-goreng",
    sku: "8998866200108",
    stockId: "543634",
    itemId: "8958356",
    name: "Indomie Goreng",
    category: "Mie Instan",
    price: 3500,
    cost: 2450,
    stock: 320,
    reorderLevel: 40,
    isActive: true,
  },
  {
    id: "prd-indomie-soto",
    sku: "8998866200115",
    stockId: "543635",
    itemId: "8958357",
    name: "Indomie Kuah Soto",
    category: "Mie Instan",
    price: 3500,
    cost: 2450,
    stock: 280,
    reorderLevel: 40,
    isActive: true,
  },
  {
    id: "prd-mie-sedaap",
    sku: "8998866500406",
    stockId: "543636",
    itemId: "4410201",
    name: "Mie Sedaap Goreng",
    category: "Mie Instan",
    price: 3400,
    cost: 2350,
    stock: 210,
    reorderLevel: 35,
    isActive: true,
  },
  {
    id: "prd-teh-botol",
    sku: "8996006858010",
    stockId: "543637",
    itemId: "7721001",
    name: "Teh Botol Sosro 350ml",
    category: "Minuman",
    price: 5000,
    cost: 3400,
    stock: 150,
    reorderLevel: 30,
    isActive: true,
  },
  {
    id: "prd-ultra-milk",
    sku: "8998009010517",
    stockId: "543638",
    itemId: "7721002",
    name: "Ultra Milk Full Cream 1L",
    category: "Minuman",
    price: 18500,
    cost: 14200,
    stock: 80,
    reorderLevel: 16,
    isActive: true,
  },
  {
    id: "prd-chitato",
    sku: "8991002101118",
    stockId: "543639",
    itemId: "6612003",
    name: "Chitato Sapi Panggang",
    category: "Snack",
    price: 12000,
    cost: 8200,
    stock: 100,
    reorderLevel: 20,
    isActive: true,
  },
  {
    id: "prd-royco-ayam",
    sku: "8999991112222",
    stockId: "543640",
    itemId: "5513004",
    name: "Royco Ayam",
    category: "Bumbu",
    price: 2500,
    cost: 1700,
    stock: 260,
    reorderLevel: 50,
    isActive: true,
  },
  {
    id: "prd-sabun-cuci",
    sku: "8999991112223",
    stockId: "543641",
    itemId: "8814005",
    name: "Sabun Cuci Piring 400ml",
    category: "Kebutuhan Rumah Tangga",
    price: 8900,
    cost: 6100,
    stock: 90,
    reorderLevel: 18,
    isActive: true,
  },
  {
    id: "prd-beras-premium",
    sku: "8997016370012",
    stockId: "543642",
    itemId: "9915006",
    name: "Beras Premium 5kg",
    category: "Beras",
    price: 78500,
    cost: 68000,
    stock: 42,
    reorderLevel: 8,
    isActive: true,
  },
  {
    id: "prd-kopi-kapal-api",
    sku: "8991002103334",
    stockId: "543643",
    itemId: "6612007",
    name: "Kopi Kapal Api Special",
    category: "Minuman",
    price: 14500,
    cost: 10300,
    stock: 72,
    reorderLevel: 14,
    isActive: true,
  },
  {
    id: "prd-minyak-1l",
    sku: "8999992223331",
    stockId: "543644",
    itemId: "9915010",
    name: "Minyak Goreng Sawit 1L",
    category: "Minyak",
    price: 18900,
    cost: 15900,
    stock: 96,
    reorderLevel: 20,
    isActive: true,
  },
  {
    id: "prd-lampu-led-9w",
    sku: "8999993334441",
    stockId: "543645",
    itemId: "9915011",
    name: "Lampu LED 9W Cool White",
    category: "Lampu",
    price: 45000,
    cost: 32000,
    stock: 36,
    reorderLevel: 8,
    isActive: true,
  },
]

const supplierSeeds: SupplierSeed[] = [
  { id: "sup-indomie", name: "PT Indomie Makmur Jaya" },
  { id: "sup-wings", name: "PT Wings Surya" },
  { id: "sup-unilever", name: "PT Unilever Indonesia Tbk" },
  { id: "sup-cocacola", name: "PT Coca-Cola Indonesia" },
  { id: "sup-beras", name: "CV Beras Nusantara" },
  { id: "sup-general", name: "PT Sumber Grosir Sejahtera" },
]

const memberSeedRows: Array<
  [string, string, string, string, string, number, string, string]
> = [
  ["m-001", "Dewi Lestari", "+62 812-9012-3344", "dewi.lestari@email.com", "gold", 12450, "active", "Jl. Merdeka No. 12, Bandung"],
  ["m-002", "Budi Santoso", "+62 878-2233-4455", "budi.s@email.com", "silver", 6200, "active", "Perumahan Hijau Blok C/4"],
  ["m-003", "Siti Nurhaliza", "+62 821-5566-7788", "siti.n@email.com", "regular", 890, "active", "Jl. Melati No. 8"],
  ["m-004", "Andi Pratama", "+62 813-3344-5566", "andi.pratama@email.com", "silver", 4100, "inactive", "Jl. Kenanga No. 19"],
  ["m-005", "Rina Wijaya", "+62 857-9900-1122", "rina.w@email.com", "gold", 18900, "active", "Jl. Sudirman Kav. 88"],
  ["m-006", "Hendra Gunawan", "+62 822-6677-8899", "hendra.g@email.com", "regular", 320, "active", "Jl. Diponegoro No. 7"],
  ["m-007", "Maya Kartika", "+62 858-4455-6677", "maya.k@email.com", "regular", 150, "inactive", "Jl. Anggrek No. 15"],
  ["m-008", "Fajar Nugroho", "+62 819-7788-9900", "fajar.n@email.com", "gold", 9750, "active", "Jl. Asia Afrika No. 10"],
  ["m-009", "Saloka Cooper", "+62 812-4444-1111", "saloka.cooper@email.com", "gold", 15000, "active", "Jl. Cendana No. 2"],
  ["m-010", "Warren Dwinanda", "+62 812-4444-2222", "warren.d@email.com", "silver", 14000, "active", "Jl. Setiabudi No. 5"],
]

const memberSeeds: MemberSeed[] = memberSeedRows.map(
  ([id, name, phone, email, tier, points, status, address]) => ({
  id,
  name,
  phone,
  email,
  tier,
  points: Number(points),
  status,
  address,
  avatarUrl: null,
})
)

async function seedSales(cashiers: { id: string; name: string }[]) {
  const paymentMethods = ["Tunai", "Kartu", "QRIS"]
  const productById = new Map(productSeeds.map((product) => [product.id!, product]))
  const transactions: (typeof salesTransactions.$inferInsert)[] = []
  const items: (typeof salesTransactionItems.$inferInsert)[] = []

  for (let i = 0; i < 90; i += 1) {
    const dayOffset = i < 8 ? 0 : Math.floor(i * 2.2)
    const at = dateDaysAgo(dayOffset, 9 + (i % 10), (i * 7) % 60)
    const txId = `TRX${String(at.getFullYear()).slice(-2)}${String(at.getMonth() + 1).padStart(2, "0")}${String(i + 1).padStart(5, "0")}`
    const cashier = cashiers[i % cashiers.length]
    const member = i % 4 === 0 ? null : memberSeeds[i % memberSeeds.length]
    const status = i % 19 === 0 ? "Dibatalkan" : "Selesai"
    const lineCount = 1 + (i % 3)
    let subtotal = 0
    let profit = 0

    for (let j = 0; j < lineCount; j += 1) {
      const product = productSeeds[(i + j * 3) % productSeeds.length]
      const quantity = 1 + ((i + j) % 4)
      const lineTotal = product.price! * quantity
      const lineProfit = (product.price! - product.cost!) * quantity
      subtotal += lineTotal
      profit += lineProfit

      if (status === "Selesai") {
        const mutableProduct = productById.get(product.id!)
        if (mutableProduct) mutableProduct.stock = Math.max(0, mutableProduct.stock! - quantity)
      }

      items.push({
        id: makeId("sale-line", items.length + 1),
        transactionId: txId,
        productId: product.id,
        productName: product.name!,
        sku: product.sku!,
        category: product.category!,
        unitPrice: product.price!,
        unitCost: product.cost!,
        quantity,
        lineTotal,
        lineProfit,
      })
    }

    const discount = subtotal >= 50_000 ? 1_000 : 0
    const tax = Math.round((subtotal - discount) * 0.11)
    const total = subtotal - discount + tax

    transactions.push({
      id: txId,
      transactionAt: at,
      memberId: member ? String(member.id) : null,
      customerId: member ? String(member.id) : "Walk-in",
      cashierId: cashier.id,
      cashierName: cashier.name,
      paymentMethod: paymentMethods[i % paymentMethods.length],
      subtotal,
      discount,
      tax,
      total,
      paidAmount: total + (i % 5) * 5000,
      changeAmount: (i % 5) * 5000,
      status,
    })

    if (member && status === "Selesai") {
      const memberSeed = memberSeeds.find((row) => row.id === member.id)
      if (memberSeed) {
        memberSeed.points =
          Number(memberSeed.points) +
          calculateEarnedMemberPoints({
            amount: total,
            tier: memberSeed.tier as MembershipTier,
            settings: defaultLoyaltySettings(),
          })
      }
    }

    void profit
  }

  await db.insert(products).values(productSeeds)
  await db.insert(members).values(memberSeeds)
  await db.insert(salesTransactions).values(transactions)
  await db.insert(salesTransactionItems).values(items)
}

async function seedPurchases(adminUserId: string) {
  await db.insert(suppliers).values(supplierSeeds)

  const records: (typeof purchaseRecords.$inferInsert)[] = []
  const lines: (typeof purchaseLines.$inferInsert)[] = []

  for (let i = 0; i < 24; i += 1) {
    const at = dateDaysAgo(i * 8, 8 + (i % 7), (i * 11) % 60)
    const supplier = supplierSeeds[i % supplierSeeds.length]
    const recordId = makeId("purchase", i + 1)
    const invoiceNo = `PMB${String(at.getFullYear()).slice(-2)}${String(at.getMonth() + 1).padStart(2, "0")}${String(i + 1).padStart(4, "0")}`
    const lineCount = 1 + (i % 3)
    let subtotal = 0

    for (let j = 0; j < lineCount; j += 1) {
      const product = productSeeds[(i + j * 2) % productSeeds.length]
      const qty = 30 + ((i + j) % 7) * 10
      subtotal += product.cost! * qty
      lines.push({
        id: makeId("purchase-line", lines.length + 1),
        purchaseId: recordId,
        productId: product.id,
        barcode: product.sku!,
        productName: product.name!,
        unitPrice: product.cost!,
        qty,
        expiry: expiry(6 + ((i + j) % 16)),
      })
    }

    const discount = i % 4 === 0 ? 25_000 : 0
    records.push({
      id: recordId,
      invoiceNo,
      supplierId: supplier.id,
      supplierName: supplier.name!,
      purchasedAt: at,
      status: i % 11 === 0 ? "Pending" : i % 17 === 0 ? "Cancelled" : "Received",
      subtotal,
      discount,
      grandTotal: subtotal - discount,
      notes: i % 3 === 0 ? "Restock berkala" : null,
      paymentMethod: i % 5 === 0 ? "Transfer" : "Tunai",
      cashPaid: subtotal - discount,
      createdByUserId: adminUserId,
    })
  }

  await db.insert(purchaseRecords).values(records)
  await db.insert(purchaseLines).values(lines)
}

async function seedAccountHistory(userId: string) {
  const routers = ["Kasir", "Penjualan", "Pelanggan", "Persediaan", "Pembelian"]
  const actions = ["LOG IN", "CREATE", "UPDATE", "DELETE"] as const
  const descriptions = [
    "User masuk ke sistem",
    "User menyelesaikan transaksi",
    "User memperbarui data pelanggan",
    "User memperbarui stok barang",
    "User mencatat pembelian",
  ]

  await db.insert(accountHistory).values(
    Array.from({ length: 60 }, (_, index) => ({
      id: makeId("log", index + 1),
      userId,
      at: dateDaysAgo(index % 45, 8 + (index % 10), (index * 9) % 60),
      router: routers[index % routers.length],
      description: descriptions[index % descriptions.length],
      action: actions[index % actions.length],
    }))
  )
}

async function main() {
  await resetDatabase()

  const admin = await createAuthUser({
    name: "Christoforus Indra",
    email: "admin@halokasir.local",
    password: "password1234",
    username: "cchristo_",
    phone: "081234567890",
    role: "Kasir",
    address: "Jl. Sudirman No. 1, Jakarta",
  })
  const sari = await createAuthUser({
    name: "Sari Wulandari",
    email: "sari@halokasir.local",
    password: "password1234",
    username: "sariw",
    phone: "081288887777",
    role: "Kasir",
    address: "Jl. Gatot Subroto No. 9, Jakarta",
  })
  const andi = await createAuthUser({
    name: "Andi Saputra",
    email: "andi@halokasir.local",
    password: "password1234",
    username: "andis",
    phone: "081299996666",
    role: "Supervisor",
    address: "Jl. Asia Afrika No. 20, Bandung",
  })

  await db.insert(appSettings).values({
    id: LOYALTY_SETTINGS_ID,
    ...defaultLoyaltySettings(),
  })

  await seedSales([
    { id: admin.id, name: admin.name },
    { id: sari.id, name: sari.name },
    { id: andi.id, name: andi.name },
  ])
  await seedPurchases(admin.id)
  await seedAccountHistory(admin.id)

  console.log("Database seeded.")
  console.log("Login: admin@halokasir.local / password1234")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
