"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { db } from "@/db"
import { accountHistory, products } from "@/db/schema"
import { mapProductToInventory } from "@/lib/data/inventory"
import { requireCurrentUser } from "@/lib/data/session"
import type { InventoryProduct } from "@/lib/inventory/types"

const productPayloadSchema = z.object({
  name: z.string().trim().min(1),
  price: z.number().int().min(0),
  stock: z.number().int().min(0),
  category: z.string().trim().min(1),
})

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function randomDigits(len: number) {
  let s = ""
  for (let i = 0; i < len; i += 1) {
    s += String(Math.floor(Math.random() * 10))
  }
  return s
}

async function logInventoryAction(userId: string, description: string) {
  await db.insert(accountHistory).values({
    id: makeId("log"),
    userId,
    router: "Persediaan",
    description,
    action: "UPDATE",
  })
}

export async function createInventoryProductAction(payload: {
  name: string
  price: number
  stock: number
  category: string
}): Promise<InventoryProduct> {
  const currentUser = await requireCurrentUser()
  const values = productPayloadSchema.parse(payload)

  const [created] = await db
    .insert(products)
    .values({
      id: makeId("prd"),
      sku: randomDigits(13),
      stockId: randomDigits(6),
      itemId: randomDigits(7),
      name: values.name,
      category: values.category,
      price: values.price,
      cost: Math.round(values.price * 0.65),
      stock: values.stock,
      imageSrc: "/placeholder-product.svg",
      reorderLevel: 10,
      isActive: true,
    })
    .returning()

  await logInventoryAction(currentUser.id, `Menambahkan barang ${created.name}`)
  revalidatePath("/inventory")
  revalidatePath("/cashier")

  return mapProductToInventory(created)
}

export async function updateInventoryProductAction(payload: {
  id: string
  name: string
  price: number
  stock: number
  category: string
}): Promise<InventoryProduct> {
  const currentUser = await requireCurrentUser()
  const values = productPayloadSchema.parse(payload)

  const [updated] = await db
    .update(products)
    .set({
      name: values.name,
      category: values.category,
      price: values.price,
      stock: values.stock,
      updatedAt: new Date(),
    })
    .where(eq(products.id, payload.id))
    .returning()

  if (!updated) {
    throw new Error("Produk tidak ditemukan.")
  }

  await logInventoryAction(currentUser.id, `Memperbarui barang ${updated.name}`)
  revalidatePath("/inventory")
  revalidatePath("/cashier")

  return mapProductToInventory(updated)
}

export async function deleteInventoryProductAction(id: string) {
  const currentUser = await requireCurrentUser()

  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ name: products.name })

  if (!deleted) {
    throw new Error("Produk tidak ditemukan.")
  }

  await logInventoryAction(currentUser.id, `Menghapus barang ${deleted.name}`)
  revalidatePath("/inventory")
  revalidatePath("/cashier")
}
