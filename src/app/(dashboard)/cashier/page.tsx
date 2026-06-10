import { CashierPageClient } from "@/components/features/cashier/cashier-page-client"
import { getCashierProducts } from "@/lib/data/inventory"
import { getMembers } from "@/lib/data/membership"
import { requireCurrentUser } from "@/lib/data/session"
import { makeCashierInvoiceNo } from "@/lib/cashier/invoice"

export default async function CashierPage() {
  const [products, members, user] = await Promise.all([
    getCashierProducts(),
    getMembers(),
    requireCurrentUser(),
  ])
  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))]
  const activeMembers = members.filter((member) => member.status === "active")

  return (
    <CashierPageClient
      products={products}
      categories={categories}
      members={activeMembers}
      cashierName={user.name}
      initialInvoiceNo={makeCashierInvoiceNo()}
    />
  )
}
