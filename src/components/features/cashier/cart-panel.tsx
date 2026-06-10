"use client"

import * as React from "react"
import { BanknoteIcon, CreditCardIcon, XIcon } from "lucide-react"

import { CartItemRow } from "@/components/features/cashier/cart-item-row"
import { CheckoutSummary } from "@/components/features/cashier/checkout-summary"
import { ClearCartDialog } from "@/components/features/cashier/clear-cart-dialog"
import { MemberPointSelector } from "@/components/features/cashier/member-point-selector"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { CashierProduct } from "@/lib/cashier/types"
import type { Member } from "@/lib/membership/types"

export type PaymentMethod = "cash" | "online"

type CartLine = {
  product: CashierProduct
  quantity: number
}

type CartPanelProps = {
  invoiceNo: string
  lines: CartLine[]
  subtotal: number
  discount: number
  tax: number
  total: number
  members: Member[]
  selectedMember: Member | null
  pointInput: string
  pointDiscount: number
  maxPointDiscount: number
  onSelectMember: (memberId: string | null) => void
  onPointInputChange: (value: string) => void
  onUseAllPoints: () => void
  onUseFullTotal: () => void
  onClearPoints: () => void
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (m: PaymentMethod) => void
  onIncrement: (productId: string) => void
  onDecrement: (productId: string) => void
  onRemove: (productId: string) => void
  onClearCart: () => void
  onCheckoutClick: () => void
}

const PAYMENT_OPTIONS: {
  id: PaymentMethod
  label: string
  icon: typeof BanknoteIcon
}[] = [
  { id: "cash", label: "Tunai", icon: BanknoteIcon },
  { id: "online", label: "Online Payment", icon: CreditCardIcon },
]

export function CartPanel({
  invoiceNo,
  lines,
  subtotal,
  discount,
  tax,
  total,
  members,
  selectedMember,
  pointInput,
  pointDiscount,
  maxPointDiscount,
  onSelectMember,
  onPointInputChange,
  onUseAllPoints,
  onUseFullTotal,
  onClearPoints,
  paymentMethod,
  onPaymentMethodChange,
  onIncrement,
  onDecrement,
  onRemove,
  onClearCart,
  onCheckoutClick,
}: CartPanelProps) {
  const [clearOpen, setClearOpen] = React.useState(false)

  return (
    <>
      <aside className="border-border bg-card flex max-h-[85vh] min-h-[420px] w-full shrink-0 flex-col overflow-hidden rounded-xl border shadow-sm lg:max-h-[calc(100dvh-9rem)] lg:min-h-[560px] lg:w-[min(100%,420px)] xl:w-[440px]">
        <div className="border-border flex items-start justify-between gap-2 border-b px-4 py-3">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-medium">
              Faktur
            </p>
            <p className="truncate font-mono text-sm font-semibold tracking-tight">
              {invoiceNo}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={lines.length === 0}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
            aria-label="Tutup faktur"
            onClick={() => setClearOpen(true)}
          >
            <XIcon className="size-5" />
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1 px-4">
          <div className="pb-4">
            {lines.length === 0 ? (
              <p className="text-muted-foreground py-12 text-center text-sm">
                Keranjang kosong — tambahkan produk dari katalog.
              </p>
            ) : (
              lines.map(({ product, quantity }) => (
                <CartItemRow
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  onIncrement={() => onIncrement(product.id)}
                  onDecrement={() => onDecrement(product.id)}
                  onRemove={() => onRemove(product.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-border mt-auto space-y-4 border-t px-4 pt-4 pb-4">
          <CheckoutSummary
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            total={total}
          />

          <MemberPointSelector
            members={members}
            selectedMember={selectedMember}
            pointInput={pointInput}
            pointDiscount={pointDiscount}
            maxPointDiscount={maxPointDiscount}
            onSelectMember={onSelectMember}
            onPointInputChange={onPointInputChange}
            onUseAllPoints={onUseAllPoints}
            onUseFullTotal={onUseFullTotal}
            onClearPoints={onClearPoints}
          />

          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">
              Metode Pembayaran
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-auto flex-col gap-1 py-2 font-normal",
                    paymentMethod === id &&
                      "border-primary bg-primary/10 text-primary ring-primary ring-2 ring-offset-2"
                  )}
                  onClick={() => onPaymentMethodChange(id)}
                >
                  <Icon className="size-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="button"
            disabled={lines.length === 0}
            className="h-12 w-full gap-2 rounded-lg bg-emerald-700 text-base font-semibold text-white hover:bg-emerald-800"
            onClick={onCheckoutClick}
          >
            <BanknoteIcon className="size-5" />
            Pembayaran
          </Button>
        </div>
      </aside>

      <ClearCartDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        onConfirm={() => {
          onClearCart()
        }}
      />
    </>
  )
}
