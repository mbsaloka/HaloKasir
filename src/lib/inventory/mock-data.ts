/** Mock persediaan — tanpa backend */

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
] as const

export const MOCK_INVENTORY_PRODUCTS: InventoryProduct[] = [
  {
    id: "inv-1",
    stockId: "543634",
    name: "Indomie Goreng",
    itemId: "8958356",
    price: 3500,
    stock: 50,
    category: "Mie Instan",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 10,
    isActive: true,
  },
  {
    id: "inv-2",
    stockId: "543635",
    name: "Indomie Goreng Sambal Matah",
    itemId: "8958357",
    price: 3800,
    stock: 8,
    category: "Mie Instan",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 10,
    isActive: true,
  },
  {
    id: "inv-3",
    stockId: "543636",
    name: "Mie Sedaap Goreng",
    itemId: "4410201",
    price: 3200,
    stock: 0,
    category: "Mie Instan",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 8,
    isActive: true,
  },
  {
    id: "inv-4",
    stockId: "543637",
    name: "Teh Botol Sosro 350ml",
    itemId: "7721001",
    price: 5000,
    stock: 120,
    category: "Minuman",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 24,
    isActive: true,
  },
  {
    id: "inv-5",
    stockId: "543638",
    name: "Ultra Milk Full Cream 1L",
    itemId: "7721002",
    price: 18500,
    stock: 6,
    category: "Minuman",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 12,
    isActive: true,
  },
  {
    id: "inv-6",
    stockId: "543639",
    name: "Chitato Sapi Panggang",
    itemId: "6612003",
    price: 12000,
    stock: 45,
    category: "Snack",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 15,
    isActive: true,
  },
  {
    id: "inv-7",
    stockId: "543640",
    name: "Royco Ayam",
    itemId: "5513004",
    price: 2500,
    stock: 200,
    category: "Bumbu",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 40,
    isActive: true,
  },
  {
    id: "inv-8",
    stockId: "543641",
    name: "Sabun Cuci Piring 400ml",
    itemId: "8814005",
    price: 8900,
    stock: 3,
    category: "Kebutuhan Rumah Tangga",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 6,
    isActive: false,
  },
  {
    id: "inv-9",
    stockId: "543642",
    name: "Beras Premium 5kg",
    itemId: "9915006",
    price: 78000,
    stock: 22,
    category: "Kebutuhan Rumah Tangga",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 5,
    isActive: true,
  },
  {
    id: "inv-10",
    stockId: "543643",
    name: "Kopi Kapal Api Special",
    itemId: "6612007",
    price: 14500,
    stock: 0,
    category: "Minuman",
    imageSrc: PLACEHOLDER_INVENTORY_IMAGE,
    reorderLevel: 10,
    isActive: true,
  },
]

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
