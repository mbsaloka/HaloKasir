export const PLACEHOLDER_PRODUCT_IMAGE = "/placeholder-product.svg"

export type CashierCategory = string

export type CashierProduct = {
  id: string
  sku: string
  name: string
  category: CashierCategory
  price: number
  imageSrc: string
}
