import { NextResponse } from "next/server"
import { z } from "zod"

import { getCurrentSession } from "@/lib/data/session"
import {
  createMidtransAuthHeader,
  getMidtransServerKey,
  MIDTRANS_STATUS_API_BASE_URL,
} from "@/lib/midtrans/sandbox"

export const runtime = "nodejs"

const statusPayloadSchema = z.object({
  orderId: z.string().trim().min(1).max(50),
})

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

function isPaidStatus(status: string | undefined, fraudStatus: string | undefined) {
  if (status === "settlement") return true
  return status === "capture" && (!fraudStatus || fraudStatus === "accept")
}

export async function POST(request: Request) {
  const session = await getCurrentSession()
  if (!session?.user?.id) {
    return jsonError("Sesi kasir sudah berakhir. Silakan login ulang.", 401)
  }

  const serverKey = getMidtransServerKey()
  if (!serverKey) {
    return jsonError("MIDTRANS_SERVER_KEY belum dikonfigurasi.", 500)
  }

  const body = await request.json().catch(() => null)
  const parsed = statusPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError("Order Midtrans tidak valid.", 400)
  }

  const response = await fetch(
    `${MIDTRANS_STATUS_API_BASE_URL}/${encodeURIComponent(parsed.data.orderId)}/status`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: createMidtransAuthHeader(serverKey),
      },
    }
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "status_message" in data
        ? String(data.status_message)
        : "Gagal memeriksa status pembayaran Midtrans."

    return jsonError(message, 502)
  }

  const transactionStatus =
    data && typeof data === "object" && "transaction_status" in data
      ? String(data.transaction_status)
      : undefined
  const fraudStatus =
    data && typeof data === "object" && "fraud_status" in data
      ? String(data.fraud_status)
      : undefined

  return NextResponse.json({
    isPaid: isPaidStatus(transactionStatus, fraudStatus),
    transactionStatus,
    fraudStatus,
    message:
      transactionStatus === "pending"
        ? "Pembayaran masih pending di Midtrans."
        : undefined,
  })
}
