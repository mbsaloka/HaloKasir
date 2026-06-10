import { eq, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

import { db, assertDatabaseConfigured } from "@/db"
import { members, products } from "@/db/schema"
import { calculateCheckoutTotals } from "@/lib/cashier/checkout-totals"
import { getCurrentSession } from "@/lib/data/session"
import {
  createMidtransAuthHeader,
  getMidtransServerKey,
  MIDTRANS_SNAP_TRANSACTION_URL,
} from "@/lib/midtrans/sandbox"

export const runtime = "nodejs"

const snapTokenPayloadSchema = z.object({
  invoiceNo: z
    .string()
    .trim()
    .min(1)
    .max(36)
    .regex(/^[A-Za-z0-9._~-]+$/),
  subtotal: z.number().int().min(0),
  discount: z.number().int().min(0),
  tax: z.number().int().min(0),
  total: z.number().int().min(1),
  memberId: z.string().trim().min(1).nullable().optional(),
  lines: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
})

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

export async function POST(request: Request) {
  assertDatabaseConfigured()

  const session = await getCurrentSession()
  if (!session?.user?.id) {
    return jsonError("Sesi kasir sudah berakhir. Silakan login ulang.", 401)
  }

  const serverKey = getMidtransServerKey()
  if (!serverKey) {
    return jsonError("MIDTRANS_SERVER_KEY belum dikonfigurasi.", 500)
  }

  const body = await request.json().catch(() => null)
  const parsed = snapTokenPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError("Payload pembayaran online tidak valid.", 400)
  }

  const values = parsed.data
  const uniqueProductIds = Array.from(
    new Set(values.lines.map((line) => line.productId))
  )
  const rows = await db
    .select()
    .from(products)
    .where(inArray(products.id, uniqueProductIds))

  const productsById = new Map(rows.map((product) => [product.id, product]))
  let serverSubtotal = 0
  let selectedMember: typeof members.$inferSelect | null = null

  for (const line of values.lines) {
    const product = productsById.get(line.productId)

    if (!product || !product.isActive) {
      return jsonError("Produk transaksi tidak ditemukan.", 404)
    }

    if (product.stock < line.quantity) {
      return jsonError(`Stok ${product.name} tidak mencukupi.`, 409)
    }

    serverSubtotal += product.price * line.quantity
  }

  if (values.memberId) {
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.id, values.memberId))
      .limit(1)

    if (!member || member.status !== "active") {
      return jsonError("Member tidak aktif atau tidak ditemukan.", 404)
    }

    selectedMember = member
  } else if (values.discount > 0) {
    return jsonError("Member wajib dipilih untuk menggunakan poin.", 400)
  }

  if (selectedMember && selectedMember.points < values.discount) {
    return jsonError("Poin member tidak mencukupi.", 409)
  }

  const calculated = calculateCheckoutTotals(serverSubtotal, values.discount)
  if (
    calculated.subtotal !== values.subtotal ||
    calculated.discount !== values.discount ||
    calculated.tax !== values.tax ||
    calculated.total !== values.total
  ) {
    return jsonError("Total transaksi berubah. Segarkan halaman kasir.", 409)
  }

  const orderId = `${values.invoiceNo}-MT-${crypto.randomUUID().slice(0, 8)}`
  const response = await fetch(MIDTRANS_SNAP_TRANSACTION_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: createMidtransAuthHeader(serverKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: calculated.total,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: session.user.name ?? "HaloKasir Customer",
        email: session.user.email ?? undefined,
      },
    }),
  })

  const midtransResponse = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      midtransResponse &&
      typeof midtransResponse === "object" &&
      "error_messages" in midtransResponse
        ? String(midtransResponse.error_messages)
        : "Gagal membuat token pembayaran Midtrans."

    return jsonError(message, 502)
  }

  if (
    !midtransResponse ||
    typeof midtransResponse !== "object" ||
    !("token" in midtransResponse) ||
    typeof midtransResponse.token !== "string"
  ) {
    return jsonError("Response Midtrans tidak berisi token pembayaran.", 502)
  }

  return NextResponse.json({
    token: midtransResponse.token,
    orderId,
  })
}
