"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { CashierCheckoutDialog } from "@/components/features/cashier/cashier-checkout-dialog"
import {
  CartPanel,
  type PaymentMethod,
} from "@/components/features/cashier/cart-panel"
import { PosLayout } from "@/components/features/cashier/pos-layout"
import { CategoryFilter } from "@/components/features/cashier/category-filter"
import {
  CashierSearchBar,
  type SortMode,
} from "@/components/features/cashier/cashier-search-bar"
import { ProductGrid } from "@/components/features/cashier/product-grid"
import { ScrollArea } from "@/components/ui/scroll-area"
import type {
  CashierCategory,
  CashierProduct,
} from "@/lib/cashier/types"
import { createSaleAction } from "@/lib/actions/sales"

type CashierPageClientProps = {
  products: CashierProduct[]
  categories: CashierCategory[]
  cashierName: string
}

function makeInvoiceNo() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `KSR${yy}${mm}${dd}${String(Date.now()).slice(-6)}`
}

export function CashierPageClient({
  products,
  categories,
  cashierName,
}: CashierPageClientProps) {
  const router = useRouter()
  const [invoiceNo, setInvoiceNo] = useState(makeInvoiceNo)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<CashierCategory>("Semua")
  const [sortMode, setSortMode] = useState<SortMode>("name")
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  )

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (category !== "Semua") {
      list = list.filter((p) => p.category === category)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      if (sortMode === "name") {
        return a.name.localeCompare(b.name, "id")
      }
      return a.price - b.price
    })

    return list
  }, [category, products, query, sortMode])

  const cartLines = useMemo(() => {
    return cart
      .map((line) => {
        const product = productById.get(line.productId)
        if (!product) return null
        return { product, quantity: line.quantity }
      })
      .filter(Boolean) as { product: CashierProduct; quantity: number }[]
  }, [cart, productById])

  const subtotal = useMemo(() => {
    return cartLines.reduce((sum, { product, quantity }) => {
      return sum + product.price * quantity
    }, 0)
  }, [cartLines])

  const discount = useMemo(() => {
    return subtotal >= 50_000 ? 1_000 : 0
  }, [subtotal])

  const taxableBase = Math.max(0, subtotal - discount)
  const tax = useMemo(() => {
    return Math.round(taxableBase * 0.11)
  }, [taxableBase])

  const total = taxableBase + tax

  function addProduct(product: CashierProduct) {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.productId === product.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = {
          ...next[i],
          quantity: next[i].quantity + 1,
        }
        return next
      }
      return [...prev, { productId: product.id, quantity: 1 }]
    })
  }

  function increment(productId: string) {
    setCart((prev) =>
      prev.map((line) =>
        line.productId === productId
          ? { ...line, quantity: line.quantity + 1 }
          : line
      )
    )
  }

  function decrement(productId: string) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity - 1 }
            : line
        )
        .filter((line) => line.quantity > 0)
    )
  }

  function removeLine(productId: string) {
    setCart((prev) => prev.filter((line) => line.productId !== productId))
  }

  function clearCart() {
    setCart([])
  }

  function toggleSort() {
    setSortMode((m) => (m === "name" ? "price" : "name"))
  }

  async function persistCheckout(paidAmount: number) {
    await createSaleAction({
      invoiceNo,
      paymentMethod,
      subtotal,
      discount,
      tax,
      total,
      paidAmount,
      lines: cart.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
      })),
    })
  }

  function completeCheckout() {
    clearCart()
    setInvoiceNo(makeInvoiceNo())
    router.refresh()
  }

  return (
    <>
      <PosLayout
        catalog={
          <section className="border-border bg-card flex min-h-0 min-w-0 flex-1 flex-col gap-3 rounded-xl border p-4 shadow-sm lg:rounded-r-none lg:border-r-0 lg:p-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold tracking-tight">
                Point of Sale
              </h1>
              <p className="text-muted-foreground text-xs">
                Kasir cepat dengan katalog dari database.
              </p>
            </div>

            <CategoryFilter
              value={category}
              categories={categories}
              onChange={setCategory}
            />

            <CashierSearchBar
              query={query}
              onQueryChange={setQuery}
              sortMode={sortMode}
              onSortToggle={toggleSort}
            />

            <ScrollArea className="min-h-[420px] flex-1 lg:min-h-0">
              <div className="pr-4 pb-4">
                <ProductGrid products={filteredProducts} onAdd={addProduct} />
              </div>
            </ScrollArea>
          </section>
        }
        cart={
          <CartPanel
            invoiceNo={invoiceNo}
            lines={cartLines}
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            total={total}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onIncrement={increment}
            onDecrement={decrement}
            onRemove={removeLine}
            onClearCart={clearCart}
            onCheckoutClick={() => setCheckoutOpen(true)}
          />
        }
      />

      <CashierCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        invoiceNo={invoiceNo}
        subtotal={subtotal}
        discount={discount}
        tax={tax}
        total={total}
        cashierName={cashierName}
        paymentMethod={paymentMethod}
        onPay={persistCheckout}
        onComplete={completeCheckout}
      />
    </>
  )
}
