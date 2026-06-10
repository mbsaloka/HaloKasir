"use server"

import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import {
  accountHistory,
  products,
  purchaseLines,
  purchaseRecords,
  suppliers,
} from "@/db/schema"
import { formatDisplayDateTime } from "@/lib/data/format"
import { requireCurrentUser } from "@/lib/data/session"
import type { IncomingGoodsRecord } from "@/lib/purchase/types"

const purchasePayloadSchema = z.object({
  supplier: z.string().trim().min(1),
  grandTotal: z.number().int().min(0),
  discount: z.number().int().min(0),
  notes: z.string().trim(),
  paymentMethod: z.string().trim().min(1),
  cashPaid: z.number().int().min(0),
  lines: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        unitPrice: z.number().int().min(0),
        qty: z.number().int().min(1),
        expiry: z.string().trim().optional().default(""),
      })
    )
    .min(1),
})

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function invoiceNo() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `PMB${yy}${mm}${dd}${String(Date.now()).slice(-6)}`
}

export async function createPurchaseAction(
  payload: z.input<typeof purchasePayloadSchema>
): Promise<IncomingGoodsRecord> {
  const currentUser = await requireCurrentUser()
  const values = purchasePayloadSchema.parse(payload)

  const now = new Date()
  const id = makeId("purchase")
  const invoice = invoiceNo()
  const subtotal = values.lines.reduce(
    (sum, line) => sum + line.unitPrice * line.qty,
    0
  )
  const recordedLines: IncomingGoodsRecord["lines"] = []

  await db.transaction(async (tx) => {
    let [supplier] = await tx
      .select()
      .from(suppliers)
      .where(eq(suppliers.name, values.supplier))
      .limit(1)

    if (!supplier) {
      ;[supplier] = await tx
        .insert(suppliers)
        .values({
          id: makeId("sup"),
          name: values.supplier,
        })
        .returning()
    }

    await tx.insert(purchaseRecords).values({
      id,
      invoiceNo: invoice,
      supplierId: supplier.id,
      supplierName: supplier.name,
      purchasedAt: now,
      status: "Received",
      subtotal,
      discount: values.discount,
      grandTotal: values.grandTotal,
      notes: values.notes || null,
      paymentMethod: values.paymentMethod,
      cashPaid: values.cashPaid,
      createdByUserId: currentUser.id,
    })

    for (const line of values.lines) {
      const [product] = await tx
        .select()
        .from(products)
        .where(eq(products.id, line.productId))
        .limit(1)

      if (!product) {
        throw new Error("Produk tidak ditemukan.")
      }

      await tx
        .update(products)
        .set({
          cost: line.unitPrice,
          stock: sql`${products.stock} + ${line.qty}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, product.id))

      const lineId = makeId("purchase-line")
      const expiry = line.expiry ?? ""

      await tx.insert(purchaseLines).values({
        id: lineId,
        purchaseId: id,
        productId: product.id,
        barcode: product.itemId,
        productName: product.name,
        unitPrice: line.unitPrice,
        qty: line.qty,
        expiry,
      })

      recordedLines.push({
        id: lineId,
        productId: product.id,
        barcode: product.itemId,
        productName: product.name,
        unitPrice: line.unitPrice,
        qty: line.qty,
        expiry,
      })
    }

    await tx.insert(accountHistory).values({
      id: makeId("log"),
      userId: currentUser.id,
      router: "Pembelian",
      description: `Mencatat pembelian ${invoice}`,
      action: "CREATE",
    })
  })

  revalidatePath("/purchase/incoming")
  revalidatePath("/purchase/report")
  revalidatePath("/inventory")
  revalidatePath("/cashier")

  return {
    id,
    invoiceNo: invoice,
    supplier: values.supplier,
    purchasedAt: formatDisplayDateTime(now),
    status: "Received",
    lines: recordedLines,
    grandTotal: values.grandTotal,
  }
}
