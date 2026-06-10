import { asc } from "drizzle-orm"

import { db, assertDatabaseConfigured } from "@/db"
import { products } from "@/db/schema"
import type { CashierProduct } from "@/lib/cashier/types"
import type { InventoryProduct } from "@/lib/inventory/types"

export function mapProductToInventory(row: typeof products.$inferSelect): InventoryProduct {
  return {
    id: row.id,
    stockId: row.stockId,
    name: row.name,
    itemId: row.itemId,
    price: row.price,
    stock: row.stock,
    category: row.category,
    imageSrc: row.imageSrc,
    reorderLevel: row.reorderLevel,
    isActive: row.isActive,
  }
}

export function mapProductToCashier(row: typeof products.$inferSelect): CashierProduct {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock,
    imageSrc: row.imageSrc,
  }
}

export async function getInventoryProducts(): Promise<InventoryProduct[]> {
  assertDatabaseConfigured()

  const rows = await db.select().from(products).orderBy(asc(products.name))
  return rows.map(mapProductToInventory)
}

export async function getCashierProducts(): Promise<CashierProduct[]> {
  assertDatabaseConfigured()

  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.category), asc(products.name))

  return rows.filter((row) => row.isActive).map(mapProductToCashier)
}

export async function getCashierCategories() {
  const products = await getCashierProducts()
  return ["Semua", ...Array.from(new Set(products.map((p) => p.category)))]
}
