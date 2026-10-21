import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { resolveImage } from '../../lib/images'
import { buildOrderMessage, whatsappUrl } from '../../lib/order'
import { useCart } from '../../store/cart'
import { useCatalog } from '../../store/catalog'
import { useSite } from '../../store/site'
import { useUI } from '../../store/ui'
import { buttonVariants } from '../ui/Button'
import { Dialog, DialogContent } from '../ui/Dialog'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI()
  const items = useCart((state) => state.items)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const removeItem = useCart((state) => state.removeItem)
  const products = useCatalog((state) => state.products)
  const site = useSite()

  const lines = useMemo(
    () =>
      items.flatMap((item) => {
        const product = products.find((candidate) => candidate.id === item.productId)
        if (!product || product.status !== 'published') return []
        return [
          {
            product,
            size: item.size,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          },
        ]
      }),
    [items, products],
  )

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0)

  return (
    <Dialog open={cartOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <DialogContent title="Tu carrito" description={`${lines.length} productos`} side="right">
        <div className="flex min-h-full flex-col">
          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">Tu carrito está vacío</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                Explora los esenciales publicados por FITS y elige tu talla.
              </p>
              <Link
                to="/tienda"
                onClick={closeCart}
                className={cn(buttonVariants({ variant: 'primary' }), 'mt-6')}
              >
                Explorar tienda
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 divide-y divide-border-subtle px-5">
                {lines.map((line) => (
                  <div
                    key={`${line.product.id}-${line.size}`}
                    className="flex gap-3 py-4"
                  >
                    <Link
                      to={`/producto/${line.product.slug}`}
                      onClick={closeCart}
                      className="shrink-0"
                    >
                      <img
                        src={resolveImage(line.product.image)}
                        alt={line.product.name}
                        className="h-24 w-20 rounded-md border border-border-subtle object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/producto/${line.product.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                        {line.product.type === 'wholesale'
                          ? `Paquete de ${line.product.packQuantity ?? 1} uds`
                          : `Talla ${line.size}`}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(line.product.id, line.size, line.quantity - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-muted hover:text-primary"
                            aria-label={`Quitar una unidad de ${line.product.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(line.product.id, line.size, line.quantity + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-muted hover:text-primary"
                            aria-label={`Añadir una unidad de ${line.product.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {formatPrice(line.lineTotal)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.product.id, line.size)}
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-error-bg hover:text-error"
                      aria-label={`Eliminar ${line.product.name} del carrito`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-subtle bg-surface p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-2">Subtotal</span>
                  <span className="font-display text-xl font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  El envío se coordina por WhatsApp.
                </p>
                <a
                  href={whatsappUrl(site.whatsapp, buildOrderMessage(lines))}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: 'whatsapp', size: 'md' }), 'mt-4 w-full')}
                >
                  Finalizar por WhatsApp
                </a>
                <Link
                  to="/carrito"
                  onClick={closeCart}
                  className={cn(buttonVariants({ variant: 'secondary', size: 'md' }), 'mt-2 w-full')}
                >
                  Ver carrito completo
                </Link>
                <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                  Demo · número configurable en el panel
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
