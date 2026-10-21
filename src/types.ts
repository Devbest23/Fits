export type ProductType = 'retail' | 'wholesale'
export type ProductStatus = 'draft' | 'published'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  category: string
  type: ProductType
  price: number
  compareAtPrice: number | null
  image: string
  sizes: string[]
  stock: number
  packQuantity: number | null
  featured: boolean
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface ProductInput {
  name: string
  description: string
  category: string
  type: ProductType
  price: number
  compareAtPrice: number | null
  image: string
  sizes: string[]
  stock: number
  packQuantity: number | null
  featured: boolean
  status: ProductStatus
}

export interface CartItem {
  productId: string
  size: string
  quantity: number
}

export interface SiteSettings {
  whatsapp: string
  whatsappDisplay: string
  email: string
  shippingNote: string
  announcement: string
}

export interface OrderLine {
  product: Product
  size: string
  quantity: number
  lineTotal: number
}
