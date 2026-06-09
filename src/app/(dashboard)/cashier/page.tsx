import { CashierPageClient } from "@/components/features/cashier/cashier-page-client"
import { getCashierProducts } from "@/lib/data/inventory"
import { requireCurrentUser } from "@/lib/data/session"

export default async function CashierPage() {
  const [products, user] = await Promise.all([
    getCashierProducts(),
    requireCurrentUser(),
  ])
  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))]

  return (
    <CashierPageClient
      products={products}
      categories={categories}
      cashierName={user.name}
    />
  )
}
