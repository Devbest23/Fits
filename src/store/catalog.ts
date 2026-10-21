import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedProducts } from '../data/seed'
import { slugify } from '../lib/format'
import type { Product, ProductInput } from '../types'

interface CatalogState {
  products: Product[]
  addProduct: (input: ProductInput) => Product
  updateProduct: (id: string, input: ProductInput) => void
  deleteProduct: (id: string) => void
  toggleStatus: (id: string) => void
  resetDemo: () => void
}

function uniqueSlug(name: string, products: Product[], currentId?: string) {
  const base = slugify(name) || 'producto'
  let candidate = base
  let counter = 2

  while (
    products.some((product) => product.slug === candidate && product.id !== currentId)
  ) {
    candidate = `${base}-${counter}`
    counter += 1
  }

  return candidate
}

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: seedProducts,

      addProduct: (input) => {
        const now = new Date().toISOString()
        const product: Product = {
          ...input,
          id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          slug: uniqueSlug(input.name, get().products),
          createdAt: now,
          updatedAt: now,
        }

        set({ products: [product, ...get().products] })
        return product
      },

      updateProduct: (id, input) => {
        set({
          products: get().products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...input,
                  updatedAt: new Date().toISOString(),
                }
              : product,
          ),
        })
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((product) => product.id !== id) })
      },

      toggleStatus: (id) => {
        set({
          products: get().products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  status: product.status === 'published' ? 'draft' : 'published',
                  updatedAt: new Date().toISOString(),
                }
              : product,
          ),
        })
      },

      resetDemo: () => set({ products: seedProducts }),
    }),
    {
      name: 'fits-demo-catalog-v1',
      version: 1,
    },
  ),
)
