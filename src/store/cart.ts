import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  addItem: (productId: string, size: string, quantity?: number) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  removeItem: (productId: string, size: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, size, quantity = 1) => {
        const existing = get().items.find(
          (item) => item.productId === productId && item.size === size,
        )

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.productId === productId && item.size === size
                ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
                : item,
            ),
          })
          return
        }

        set({ items: [...get().items, { productId, size, quantity }] })
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: Math.min(quantity, 99) }
              : item,
          ),
        })
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.size === size),
          ),
        })
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'fits-demo-cart-v1',
      version: 1,
    },
  ),
)

export function useCartCount() {
  return useCart((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )
}
