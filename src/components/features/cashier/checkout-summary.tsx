import { formatRupiah } from "@/lib/cashier/format-rupiah"

type CheckoutSummaryProps = {
  subtotal: number
  discount: number
  tax: number
  total: number
}

export function CheckoutSummary({
  subtotal,
  discount,
  tax,
  total,
}: CheckoutSummaryProps) {
  return (
    <div className="border-border space-y-2 border-t pt-4 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="tabular-nums">{formatRupiah(subtotal)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Diskon Poin</span>
        <span className="tabular-nums text-emerald-700">
          {discount > 0 ? `- ${formatRupiah(discount)}` : formatRupiah(0)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Pajak</span>
        <span className="tabular-nums">{formatRupiah(tax)}</span>
      </div>
      <div className="flex justify-between gap-4 pt-2 text-base font-bold">
        <span>Total</span>
        <span className="text-foreground tabular-nums">{formatRupiah(total)}</span>
      </div>
    </div>
  )
}
