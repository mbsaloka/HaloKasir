export type InventoryProduct = {
  id: string
  stockId: string
  name: string
  itemId: string
  price: number
  stock: number
  category: string
  imageSrc: string
  reorderLevel: number
  isActive: boolean
}

export const PLACEHOLDER_INVENTORY_IMAGE = "/placeholder-product.svg"

export const INVENTORY_CATEGORIES = [
  "Semua",
  "Mie Instan",
  "Minuman",
  "Snack",
  "Bumbu",
  "Kebutuhan Rumah Tangga",
  "Jajan",
  "Sabun",
  "Minyak",
  "Beras",
  "Lampu",
] as const

export const INVENTORY_PAGE_SIZE = 8

export function filterInventoryProducts(
  products: InventoryProduct[],
  search: string,
  categoryFilter: string
): InventoryProduct[] {
  const q = search.trim().toLowerCase()
  return products.filter((p) => {
    if (categoryFilter && categoryFilter !== "Semua" && p.category !== categoryFilter) {
      return false
    }
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.itemId.toLowerCase().includes(q) ||
      p.stockId.toLowerCase().includes(q)
    )
  })
}
