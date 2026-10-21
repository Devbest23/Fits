import { formatPrice } from './format'
import type { OrderLine, Product } from '../types'

export function whatsappUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function buildOrderMessage(lines: OrderLine[]) {
  const body = lines
    .map((line) => {
      const variant =
        line.product.type === 'wholesale'
          ? `Paquete de ${line.product.packQuantity ?? 1} uds`
          : `Talla ${line.size}`
      return `• ${line.quantity}x ${line.product.name} — ${variant} — ${formatPrice(line.lineTotal)}`
    })
    .join('\n')

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0)

  return `Hola FITS. Quiero confirmar este pedido:\n\n${body}\n\nTotal: ${formatPrice(total)}\n\nPedido generado desde la demo de la tienda.`
}

export function buildProductInquiry(product: Product) {
  const variant =
    product.type === 'wholesale'
      ? `el paquete de ${product.packQuantity ?? 1} unidades`
      : 'este producto'
  return `Hola FITS. Quiero consultar por ${variant}: ${product.name}.`
}
