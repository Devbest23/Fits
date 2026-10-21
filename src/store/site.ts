import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SiteSettings } from '../types'

const defaultSettings: SiteSettings = {
  whatsapp: '1234567890',
  whatsappDisplay: '+1 (234) 567-890 · demo',
  email: 'hola@fits.demo',
  shippingNote:
    'El costo de envío se confirma por WhatsApp según tu ciudad. En la versión final se conectará con la API de la tienda.',
  announcement: 'Prototipo navegable · Pedidos por WhatsApp',
}

interface SiteState extends SiteSettings {
  updateSettings: (settings: Partial<SiteSettings>) => void
  resetSettings: () => void
}

export const useSite = create<SiteState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (settings) => set(settings),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'fits-demo-site-v1',
      version: 1,
    },
  ),
)

export { defaultSettings }
