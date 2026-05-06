import type { InventoryProduct } from "@/lib/inventory/mock-data"

export type StockLevel = "in_stock" | "low_stock" | "out_of_stock"

export function getStockLevel(product: InventoryProduct): StockLevel {
  if (product.stock <= 0) return "out_of_stock"
  if (product.stock <= product.reorderLevel) return "low_stock"
  return "in_stock"
}
