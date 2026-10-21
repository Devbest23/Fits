import { create } from 'zustand'

interface UIState {
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
}))
