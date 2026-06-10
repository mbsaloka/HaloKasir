import { Buffer } from "node:buffer"

export const MIDTRANS_SNAP_SCRIPT_URL =
  "https://app.sandbox.midtrans.com/snap/snap.js"

export const MIDTRANS_SNAP_TRANSACTION_URL =
  "https://app.sandbox.midtrans.com/snap/v1/transactions"

export const MIDTRANS_STATUS_API_BASE_URL =
  "https://api.sandbox.midtrans.com/v2"

export function getMidtransClientKey() {
  return (
    process.env.MIDTRANS_CLIENT_KEY ??
    process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ??
    process.env.MIDTRANS_SANDBOX_CLIENT_KEY ??
    process.env.NEXT_PUBLIC_MIDTRANS_SANDBOX_CLIENT_KEY
  )
}

export function getMidtransServerKey() {
  return process.env.MIDTRANS_SERVER_KEY ?? process.env.MIDTRANS_SANDBOX_SERVER_KEY
}

export function createMidtransAuthHeader(serverKey: string) {
  return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`
}
