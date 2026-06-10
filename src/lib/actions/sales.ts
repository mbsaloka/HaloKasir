"use server"

import { and, eq, gte, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import {
  accountHistory,
  appSettings,
  members,
  products,
  salesTransactionItems,
  salesTransactions,
} from "@/db/schema"
import { calculateCheckoutTotals } from "@/lib/cashier/checkout-totals"
import { requireCurrentUser } from "@/lib/data/session"
import {
  calculateEarnedMemberPoints,
  defaultLoyaltySettings,
  LOYALTY_SETTINGS_ID,
} from "@/lib/settings/loyalty"
import type { MembershipTier } from "@/lib/membership/types"

type PaymentMethodValue = "cash" | "online" | "card" | "qris"

const checkoutPayloadSchema = z.object({
  invoiceNo: z.string().trim().min(1),
  paymentMethod: z.enum(["cash", "online", "card", "qris"]),
  memberId: z.string().trim().min(1).nullable().optional(),
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

function paymentMethodLabel(value: PaymentMethodValue) {
  if (value === "online") return "Online Payment"
  if (value === "card") return "Kartu"
  if (value === "qris") return "QRIS"
  return "Tunai"
}

export async function createSaleAction(payload: z.input<typeof checkoutPayloadSchema>) {
  const currentUser = await requireCurrentUser()
  const values = checkoutPayloadSchema.parse(payload)

  await db.transaction(async (tx) => {
    const lineRows = []
    let serverSubtotal = 0
    let selectedMember: typeof members.$inferSelect | null = null
    let earnedPoints = 0

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
      serverSubtotal += product.price * line.quantity

      await tx
        .update(products)
        .set({
          stock: sql`${products.stock} - ${line.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, product.id))
    }

    if (values.memberId) {
      const [member] = await tx
        .select()
        .from(members)
        .where(eq(members.id, values.memberId))
        .limit(1)

      if (!member) {
        throw new Error("Member transaksi tidak ditemukan.")
      }

      if (member.status !== "active") {
        throw new Error("Member tidak aktif dan tidak bisa memakai poin.")
      }

      const maxPointDiscount = Math.min(member.points, serverSubtotal)
      if (values.discount > maxPointDiscount) {
        throw new Error("Poin member tidak mencukupi.")
      }

      selectedMember = member
    } else if (values.discount > 0) {
      throw new Error("Diskon poin membutuhkan member.")
    }

    const calculated = calculateCheckoutTotals(serverSubtotal, values.discount)
    if (
      calculated.subtotal !== values.subtotal ||
      calculated.discount !== values.discount ||
      calculated.tax !== values.tax ||
      calculated.total !== values.total
    ) {
      throw new Error("Total transaksi berubah. Segarkan halaman kasir.")
    }

    const paidAmount =
      values.paymentMethod === "cash" ? values.paidAmount : calculated.total

    if (paidAmount < calculated.total) {
      throw new Error("Nominal pembayaran kurang dari total transaksi.")
    }

    if (selectedMember) {
      const [settingsRow] = await tx
        .select({
          pointEarnRateBps: appSettings.pointEarnRateBps,
          goldPointMultiplierBps: appSettings.goldPointMultiplierBps,
        })
        .from(appSettings)
        .where(eq(appSettings.id, LOYALTY_SETTINGS_ID))
        .limit(1)

      earnedPoints = calculateEarnedMemberPoints({
        amount: calculated.total,
        tier: selectedMember.tier as MembershipTier,
        settings: settingsRow ?? defaultLoyaltySettings(),
      })
    }

    if (selectedMember && (calculated.discount > 0 || earnedPoints > 0)) {
      const [updatedMember] = await tx
        .update(members)
        .set({
          points: sql`${members.points} - ${calculated.discount} + ${earnedPoints}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(members.id, selectedMember.id),
            eq(members.status, "active"),
            gte(members.points, calculated.discount)
          )
        )
        .returning({ id: members.id })

      if (!updatedMember) {
        throw new Error("Poin member berubah. Ulangi pembayaran.")
      }
    }

    await tx.insert(salesTransactions).values({
      id: values.invoiceNo,
      memberId: selectedMember?.id ?? null,
      customerId: selectedMember?.name ?? "Walk-in",
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      paymentMethod: paymentMethodLabel(values.paymentMethod),
      subtotal: calculated.subtotal,
      discount: calculated.discount,
      tax: calculated.tax,
      total: calculated.total,
      paidAmount,
      changeAmount: Math.max(0, paidAmount - calculated.total),
      status: "Selesai",
    })

    await tx.insert(salesTransactionItems).values(lineRows)

    await tx.insert(accountHistory).values({
      id: makeId("log"),
      userId: currentUser.id,
      router: "Kasir",
      description:
        selectedMember && earnedPoints > 0
          ? `Menyelesaikan transaksi ${values.invoiceNo} (+${earnedPoints} poin)`
          : `Menyelesaikan transaksi ${values.invoiceNo}`,
      action: "CREATE",
    })
  })

  revalidatePath("/")
  revalidatePath("/cashier")
  revalidatePath("/inventory")
  revalidatePath("/membership")
  revalidatePath("/sales/report")
  revalidatePath("/sales/transactions")

  return { id: values.invoiceNo }
}
