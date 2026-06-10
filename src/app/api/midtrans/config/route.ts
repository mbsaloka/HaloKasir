import { NextResponse } from "next/server"

import {
  getMidtransClientKey,
  MIDTRANS_SNAP_SCRIPT_URL,
} from "@/lib/midtrans/sandbox"

export const runtime = "nodejs"

export async function GET() {
  const clientKey = getMidtransClientKey()

  if (!clientKey) {
    return NextResponse.json(
      { error: "MIDTRANS_CLIENT_KEY belum dikonfigurasi." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    )
  }

  return NextResponse.json(
    {
      clientKey,
      scriptUrl: MIDTRANS_SNAP_SCRIPT_URL,
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
