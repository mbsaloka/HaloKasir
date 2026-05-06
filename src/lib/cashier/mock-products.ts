/** Gambar placeholder — gunakan SVG lokal (fallback aman tanpa API) */
export const PLACEHOLDER_PRODUCT_IMAGE = "/placeholder-product.svg"

/** Nama kasir di modal pembayaran (mock, selaras Figma) */
export const MOCK_CASHIER_DISPLAY_NAME = "Christoforus"

export type CashierCategory =
  | "Semua"
  | "Jajan"
  | "Sabun"
  | "Minyak"
  | "Beras"
  | "Lampu"

export const CASHIER_CATEGORIES: CashierCategory[] = [
  "Semua",
  "Jajan",
  "Sabun",
  "Minyak",
  "Beras",
  "Lampu",
]

export type CashierProduct = {
  id: string
  sku: string
  name: string
  category: Exclude<CashierCategory, "Semua">
  price: number
  imageSrc: string
}

/** Dummy katalog POS — density tinggi, tanpa backend */
export const MOCK_PRODUCTS: CashierProduct[] = [
  {
    id: "p1",
    sku: "0089686010824",
    name: "Indomie Goreng Spesial",
    category: "Jajan",
    price: 3500,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p2",
    sku: "0089686010825",
    name: "Indomie Kuah Soto",
    category: "Jajan",
    price: 3500,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p3",
    sku: "0089686010826",
    name: "Chitato Lite Barbecue",
    category: "Jajan",
    price: 12000,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p4",
    sku: "0089686010827",
    name: "Lifebuoy Sabun Cair Refill",
    category: "Sabun",
    price: 18500,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p5",
    sku: "0089686010828",
    name: "Daia Deterjen Bubuk",
    category: "Sabun",
    price: 14900,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p6",
    sku: "0089686010829",
    name: "Minyak Goreng Sawit 1L",
    category: "Minyak",
    price: 18900,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p7",
    sku: "0089686010830",
    name: "Minyak Goreng Kelapa 500ml",
    category: "Minyak",
    price: 12900,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p8",
    sku: "0089686010831",
    name: "Beras Premium 5kg",
    category: "Beras",
    price: 78500,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p9",
    sku: "0089686010832",
    name: "Beras Medium 2kg",
    category: "Beras",
    price: 28500,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p10",
    sku: "0089686010833",
    name: "Lampu LED 9W Cool White",
    category: "Lampu",
    price: 45000,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p11",
    sku: "0089686010834",
    name: "Lampu LED 5W Warm White",
    category: "Lampu",
    price: 32000,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
  {
    id: "p12",
    sku: "0089686010835",
    name: "Marjan Syrup 460ml",
    category: "Jajan",
    price: 28000,
    imageSrc: PLACEHOLDER_PRODUCT_IMAGE,
  },
]

export const MOCK_INVOICE_NO = "KPTH2601290001"
