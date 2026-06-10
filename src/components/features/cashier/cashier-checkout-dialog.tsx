"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Script from "next/script"
import { CheckCircle2Icon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/components/features/cashier/cart-panel"
import { formatRupiah } from "@/lib/cashier/format-rupiah"

type CheckoutPhase = "pay" | "success"

type MidtransConfig = {
  clientKey: string
  scriptUrl: string
}

type MidtransSnapResult = {
  order_id?: string
  status_code?: string
  status_message?: string
  transaction_id?: string
  transaction_status?: string
}

type MidtransSnapOptions = {
  language?: "id" | "en"
  onSuccess?: (result: MidtransSnapResult) => void
  onPending?: (result: MidtransSnapResult) => void
  onError?: (result: MidtransSnapResult) => void
  onClose?: () => void
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: MidtransSnapOptions) => void
    }
  }
}

type CashierCheckoutDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceNo: string
  subtotal: number
  discount: number
  tax: number
  total: number
  cashierName: string
  paymentMethod: PaymentMethod
  memberId?: string | null
  lines: { productId: string; quantity: number }[]
  onPay: (paidAmount: number) => void | Promise<void>
  onComplete?: () => void
}

function parseDigitsOnly(formatted: string): number {
  const digits = formatted.replace(/\D/g, "")
  if (!digits) return 0
  return Number(digits)
}

function formatIdrTyping(digitsRaw: string): string {
  const digits = digitsRaw.replace(/\D/g, "")
  if (!digits) return ""
  return Number(digits).toLocaleString("id-ID")
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Pembayaran gagal diproses."
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

async function readJsonOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : "Permintaan gagal diproses."
    throw new Error(message)
  }

  return data as T
}

function PaymentDetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <div className="flex justify-between gap-6 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span
        className={cn(
          "text-foreground min-w-0 text-right font-medium tabular-nums",
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function CashierCheckoutDialog({
  open,
  onOpenChange,
  invoiceNo,
  subtotal,
  discount,
  tax,
  total,
  cashierName,
  paymentMethod,
  memberId,
  lines,
  onPay,
  onComplete,
}: CashierCheckoutDialogProps) {
  const [phase, setPhase] = useState<CheckoutPhase>("pay")
  const [paidInput, setPaidInput] = useState("")
  const [paidAmount, setPaidAmount] = useState(0)
  const [isPaying, setIsPaying] = useState(false)
  const [midtransConfig, setMidtransConfig] = useState<MidtransConfig | null>(
    null
  )
  const [isLoadingMidtrans, setIsLoadingMidtrans] = useState(false)
  const [isSnapReady, setIsSnapReady] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const skipNextOpenResetRef = useRef(false)
  const midtransDialogHiddenRef = useRef(false)

  const tanggal = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date())
  }, [])

  const metodeLabel =
    paymentMethod === "cash"
      ? "Tunai"
      : "Online Payment"

  useEffect(() => {
    if (open) {
      if (skipNextOpenResetRef.current) {
        skipNextOpenResetRef.current = false
        return
      }

      setPhase("pay")
      setPaidInput("")
      setPaidAmount(0)
      setIsPaying(false)
      setPaymentError(null)
    }
  }, [open])

  useEffect(() => {
    if (!open || paymentMethod !== "online" || midtransConfig) {
      return
    }

    let ignore = false
    setIsLoadingMidtrans(true)

    fetch("/api/midtrans/config", { cache: "no-store" })
      .then((response) => readJsonOrThrow<MidtransConfig>(response))
      .then((config) => {
        if (!ignore) {
          setMidtransConfig(config)
        }
      })
      .catch((error) => {
        if (!ignore) {
          setPaymentError(getErrorMessage(error))
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoadingMidtrans(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [midtransConfig, open, paymentMethod])

  const paidParsed = parseDigitsOnly(paidInput)
  const cashValid = paymentMethod !== "cash" || paidParsed >= total
  const onlineReady =
    paymentMethod !== "online" || Boolean(midtransConfig && isSnapReady)

  function handlePaidChange(raw: string) {
    setPaidInput(formatIdrTyping(raw))
  }

  async function verifyMidtransPayment(orderId: string) {
    const response = await fetch("/api/midtrans/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })

    return readJsonOrThrow<{
      isPaid: boolean
      transactionStatus?: string
      message?: string
    }>(response)
  }

  async function createMidtransToken() {
    const response = await fetch("/api/midtrans/snap-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceNo,
        subtotal,
        discount,
        tax,
        total,
        memberId,
        lines,
      }),
    })

    return readJsonOrThrow<{ token: string; orderId: string }>(response)
  }

  async function handleOnlinePayment() {
    if (!window.snap || !midtransConfig || !onlineReady) {
      throw new Error("Midtrans belum siap. Coba lagi sebentar.")
    }

    const { token, orderId } = await createMidtransToken()
    skipNextOpenResetRef.current = true
    midtransDialogHiddenRef.current = true
    onOpenChange(false)
    await waitForNextPaint()
    document.body.style.pointerEvents = ""

    await new Promise<void>((resolve, reject) => {
      try {
        window.snap?.pay(token, {
          language: "id",
          onSuccess: (result) => {
            const resultOrderId = result.order_id ?? orderId

            if (resultOrderId !== orderId) {
              reject(new Error("Order Midtrans tidak sesuai."))
              return
            }

            void verifyMidtransPayment(resultOrderId)
              .then(async (status) => {
                if (!status.isPaid) {
                  throw new Error(
                    status.message ??
                      "Status pembayaran Midtrans belum berhasil."
                  )
                }

                await onPay(total)
                setPaidAmount(total)
                setPhase("success")
                skipNextOpenResetRef.current = true
                midtransDialogHiddenRef.current = false
                onOpenChange(true)
                resolve()
              })
              .catch(reject)
          },
          onPending: () => {
            reject(
              new Error(
                "Pembayaran masih pending di Midtrans Sandbox. Selesaikan pembayaran, lalu coba lagi."
              )
            )
          },
          onError: (result) => {
            reject(
              new Error(
                result.status_message ?? "Pembayaran online gagal di Midtrans."
              )
            )
          },
          onClose: () => {
            reject(
              new Error("Popup Midtrans ditutup sebelum pembayaran selesai.")
            )
          },
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async function handleBayar() {
    if (paymentMethod === "cash" && (!cashValid || paidParsed < total)) return

    const nextPaidAmount = paymentMethod === "cash" ? paidParsed : total
    setIsPaying(true)
    setPaymentError(null)
    try {
      if (paymentMethod === "online") {
        await handleOnlinePayment()
      } else {
        await onPay(nextPaidAmount)
        setPaidAmount(nextPaidAmount)
        setPhase("success")
      }
    } catch (error) {
      if (paymentMethod === "online" && midtransDialogHiddenRef.current) {
        skipNextOpenResetRef.current = true
        midtransDialogHiddenRef.current = false
        onOpenChange(true)
      }
      setPaymentError(getErrorMessage(error))
    } finally {
      setIsPaying(false)
    }
  }

  function handleSelesai() {
    onComplete?.()
    onOpenChange(false)
  }

  const kembalian = Math.max(0, paidAmount - total)

  return (
    <>
      {midtransConfig ? (
        <Script
          id="midtrans-snap"
          src={midtransConfig.scriptUrl}
          data-client-key={midtransConfig.clientKey}
          strategy="afterInteractive"
          onReady={() => setIsSnapReady(true)}
          onError={() => {
            setIsSnapReady(false)
            setPaymentError("Gagal memuat Snap Midtrans.")
          }}
        />
      ) : null}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton
          className="gap-0 overflow-hidden p-0 sm:max-w-lg"
        >
        {phase === "pay" ? (
          <>
            <DialogHeader className="border-border border-b px-6 py-4">
              <DialogTitle className="text-lg font-bold">Pembayaran</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 px-6 py-5">
              <div className="space-y-3">
                <PaymentDetailRow label="Tanggal" value={tanggal} />
                <PaymentDetailRow label="Kasir" value={cashierName} />
                <PaymentDetailRow label="Faktur" value={invoiceNo} />
                <PaymentDetailRow
                  label="Metode Pembayaran"
                  value={metodeLabel}
                />
                <PaymentDetailRow label="Subtotal" value={formatRupiah(subtotal)} />
                <PaymentDetailRow
                  label="Diskon Poin"
                  value={formatRupiah(discount)}
                />
                <PaymentDetailRow label="Pajak" value={formatRupiah(tax)} />
                <PaymentDetailRow
                  label="Total"
                  value={formatRupiah(total)}
                  valueClassName="text-lg font-bold text-foreground"
                />
              </div>

              {paymentMethod === "cash" ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground w-14 shrink-0 text-sm font-medium">
                      Tunai
                    </span>
                    <div className="border-input bg-background flex min-h-14 flex-1 items-center rounded-lg border px-4 shadow-xs">
                      <span className="text-muted-foreground pr-2 text-lg font-semibold">
                        Rp
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="0"
                        value={paidInput}
                        onChange={(e) => handlePaidChange(e.target.value)}
                        className="placeholder:text-muted-foreground/50 min-w-0 flex-1 border-0 bg-transparent text-right text-2xl font-bold tracking-tight outline-none"
                        aria-label="Nominal dibayarkan"
                      />
                    </div>
                  </div>
                  {paidParsed > 0 && paidParsed < total && (
                    <p className="text-destructive pl-[calc(3.5rem+0.75rem)] text-xs">
                      Nominal kurang dari total ({formatRupiah(total)}).
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground text-sm">
                    Lanjutkan pembayaran online melalui Midtrans Sandbox sebesar{" "}
                    <strong>{formatRupiah(total)}</strong>.
                  </p>
                  {isLoadingMidtrans && (
                    <p className="text-muted-foreground text-xs">
                      Memuat Midtrans Sandbox...
                    </p>
                  )}
                </div>
              )}

              {paymentError && (
                <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-xs">
                  {paymentError}
                </p>
              )}
            </div>

            <DialogFooter className="border-border flex-row justify-end gap-2 border-t px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Kembali
              </Button>
              <Button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[112px] font-semibold"
                disabled={
                  isPaying ||
                  (paymentMethod === "cash" && !cashValid) ||
                  (paymentMethod === "online" && !onlineReady)
                }
                onClick={handleBayar}
              >
                {isPaying
                  ? paymentMethod === "online"
                    ? "Memproses..."
                    : "Menyimpan..."
                  : paymentMethod === "online"
                    ? "Bayar Online"
                    : "Bayar"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="border-border border-b px-6 py-4">
              <DialogTitle className="text-lg font-bold">
                Pembayaran selesai
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-6 px-6 py-10 text-center">
              <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                <CheckCircle2Icon className="text-primary size-10" />
              </div>

              {paymentMethod === "cash" ? (
                <>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Kembalian</p>
                    <p className="text-primary text-4xl font-bold tabular-nums">
                      {formatRupiah(kembalian)}
                    </p>
                  </div>
                  <p className="text-muted-foreground max-w-sm text-sm">
                    Total tagihan {formatRupiah(total)} - Dibayar{" "}
                    {formatRupiah(paidAmount)}.
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground max-w-sm text-sm">
                  Transaksi <strong>{metodeLabel}</strong> senilai{" "}
                  <strong>{formatRupiah(total)}</strong> telah dikonfirmasi.
                </p>
              )}

              <Button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full max-w-xs font-semibold"
                onClick={handleSelesai}
              >
                Selesai
              </Button>
            </div>
          </>
        )}
        </DialogContent>
      </Dialog>
    </>
  )
}
