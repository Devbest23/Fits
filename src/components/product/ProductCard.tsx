import { ArrowUpRight, Plus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { discountPercent, formatPrice } from '../../lib/format'
import { resolveImage } from '../../lib/images'
import { useCart } from '../../store/cart'
import { useUI } from '../../store/ui'
import type { Product } from '../../types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Dialog, DialogContent } from '../ui/Dialog'
import { useToast } from '../ui/Toast'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const addItem = useCart((state) => state.addItem)
  const openCart = useUI((state) => state.openCart)
  const { toast } = useToast()

  const discount = discountPercent(product.price, product.compareAtPrice)
  const isWholesale = product.type === 'wholesale'
  const soldOut = product.stock <= 0

  function commitAdd(size: string) {
    addItem(product.id, size, 1)
    toast({
      variant: 'success',
      title: 'Añadido al carrito',
      description: `${product.name} · ${isWholesale ? 'paquete' : `talla ${size}`}`,
    })
    setQuickAddOpen(false)
    setSelectedSize(null)
    openCart()
  }

  function handleQuickAdd() {
    if (soldOut) {
      toast({
        variant: 'error',
        title: 'Producto agotado',
        description: 'Escríbenos por WhatsApp para consultar reposición.',
      })
      return
    }

    if (isWholesale) {
      commitAdd('PAQUETE')
      return
    }

    if (product.sizes.length === 1) {
      commitAdd(product.sizes[0])
      return
    }

    setQuickAddOpen(true)
  }

  return (
    <>
      <article className="group flex h-full flex-col">
        <div className="relative overflow-hidden rounded-lg border border-border-subtle bg-surface-strong">
          <Link
            to={`/producto/${product.slug}`}
            className="block aspect-[4/5] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`Ver ${product.name}`}
          >
            <img
              src={resolveImage(product.image)}
              alt={product.name}
              loading={priority ? 'eager' : 'lazy'}
              width="800"
              height="1000"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            />
          </Link>

          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {soldOut ? <Badge variant="neutral">Agotado</Badge> : null}
            {!soldOut && discount ? <Badge variant="error">−{discount}%</Badge> : null}
            {!soldOut && isWholesale ? <Badge variant="primary">Al mayor</Badge> : null}
            {!soldOut && product.featured && !isWholesale && !discount ? (
              <Badge variant="primary">Favorito</Badge>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={cn(
              'absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100',
              soldOut && 'bg-muted text-white hover:bg-muted',
            )}
            aria-label={soldOut ? `${product.name} agotado` : `Añadir ${product.name} al carrito`}
          >
            {soldOut ? (
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Plus className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="flex flex-1 flex-col pt-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                {isWholesale ? `Pack de ${product.packQuantity ?? 1} uds` : product.category}
              </p>
              <Link
                to={`/producto/${product.slug}`}
                className="mt-1 block font-display text-[15px] font-semibold leading-snug text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {product.name}
              </Link>
            </div>
            <ArrowUpRight
              className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice ? (
                  <span className="font-mono text-[11px] text-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                ) : null}
              </div>
              {isWholesale && product.packQuantity ? (
                <p className="mt-0.5 text-[11px] text-muted">
                  {formatPrice(product.price / product.packQuantity)} por unidad
                </p>
              ) : null}
            </div>
            {product.stock > 0 && product.stock <= 5 ? (
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-warning">
                Últimas {product.stock}
              </p>
            ) : null}
          </div>
        </div>
      </article>

      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent
          title="Elige tu talla"
          description={product.name}
          side="center"
          className="max-w-md"
        >
          <div className="p-5">
            <div className="flex gap-4 rounded-lg bg-surface-muted p-3">
              <img
                src={resolveImage(product.image)}
                alt={product.name}
                className="h-24 w-20 rounded-md object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="mt-1 font-mono text-sm text-primary">{formatPrice(product.price)}</p>
                <p className="mt-1 text-xs text-muted">
                  {product.stock} disponibles · Imagen de referencia
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold">Talla</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={cn(
                      'flex h-11 min-w-11 items-center justify-center rounded-md border px-3 font-mono text-xs transition-colors',
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-surface text-foreground hover:border-primary',
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="mt-6 w-full"
              onClick={() => selectedSize && commitAdd(selectedSize)}
              disabled={!selectedSize}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Añadir al carrito
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              Eliges la talla antes de añadir. Así evitamos pedidos con la talla equivocada.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
