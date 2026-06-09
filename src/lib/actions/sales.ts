"use server"

import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import {
  accountHistory,
  products,
  salesTransactionItems,
  salesTransactions,
} from "@/db/schema"
import { requireCurrentUser } from "@/lib/data/session"

const checkoutPayloadSchema = z.object({
  invoiceNo: z.string().trim().min(1),
  paymentMethod: z.enum(["cash", "card", "qris"]),
  subtotal: z.number().int().min(0),
  discount: z.number().int().min(0),
  tax: z.number().int().min(0),
  total: z.number().int().min(0),
  paidAmount: z.number().int().min(0),
  lines: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
})

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function paymentMethodLabel(value: "cash" | "card" | "qris") {
  if (value === "card") return "Kartu"
  if (value === "qris") return "QRIS"
  return "Tunai"
}

export async function createSaleAction(payload: z.input<typeof checkoutPayloadSchema>) {
  const currentUser = await requireCurrentUser()
  const values = checkoutPayloadSchema.parse(payload)

  await db.transaction(async (tx) => {
    const lineRows = []

    for (const line of values.lines) {
      const [product] = await tx
        .select()
        .from(products)
        .where(eq(products.id, line.productId))
        .limit(1)

      if (!product) {
        throw new Error("Produk transaksi tidak ditemukan.")
      }

      if (product.stock < line.quantity) {
        throw new Error(`Stok ${product.name} tidak mencukupi.`)
      }

      lineRows.push({
        id: makeId("sale-line"),
        transactionId: values.invoiceNo,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        category: product.category,
        unitPrice: product.price,
        unitCost: product.cost,
        quantity: line.quantity,
        lineTotal: product.price * line.quantity,
        lineProfit: (product.price - product.cost) * line.quantity,
      })

      await tx
        .update(products)
        .set({
          stock: sql`${products.stock} - ${line.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, product.id))
    }

    await tx.insert(salesTransactions).values({
      id: values.invoiceNo,
      customerId: "Walk-in",
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      paymentMethod: paymentMethodLabel(values.paymentMethod),
      subtotal: values.subtotal,
      discount: values.discount,
      tax: values.tax,
      total: values.total,
      paidAmount: values.paidAmount,
      changeAmount: Math.max(0, values.paidAmount - values.total),
      status: "Selesai",
    })

    await tx.insert(salesTransactionItems).values(lineRows)

    await tx.insert(accountHistory).values({
      id: makeId("log"),
      userId: currentUser.id,
      router: "Kasir",
      description: `Menyelesaikan transaksi ${values.invoiceNo}`,
      action: "CREATE",
    })
  })

  revalidatePath("/")
  revalidatePath("/cashier")
  revalidatePath("/inventory")
  revalidatePath("/sales/report")
  revalidatePath("/sales/transactions")

  return { id: values.invoiceNo }
}
