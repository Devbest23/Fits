import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductGrid'
import { QuantityStepper } from '../components/product/QuantityStepper'
import { buttonVariants } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { formatPrice } from '../lib/format'
import { resolveImage } from '../lib/images'
import { buildOrderMessage, whatsappUrl } from '../lib/order'
import { usePageTitle } from '../lib/usePageTitle'
import { useCart } from '../store/cart'
import { useCatalog } from '../store/catalog'
import { useSite } from '../store/site'

export function CartPage() {
  usePageTitle('Carrito')
  const items = useCart((state) => state.items)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const removeItem = useCart((state) => state.removeItem)
  const clear = useCart((state) => state.clear)
  const products = useCatalog((state) => state.products)
  const site = useSite()
  const [confirmClear, setConfirmClear] = useState(false)

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

  const invalidKey = useMemo(
    () =>
      items
        .filter((item) => {
          const product = products.find((candidate) => candidate.id === item.productId)
          return !product || product.status !== 'published'
        })
        .map((item) => `${item.productId}::${item.size}`)
        .join('|'),
    [items, products],
  )

  useEffect(() => {
    if (!invalidKey) return
    invalidKey.split('|').forEach((entry) => {
      const [productId, size] = entry.split('::')
      if (productId && size) removeItem(productId, size)
    })
  }, [invalidKey, removeItem])

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0)
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0)

  const recommendations = useMemo(() => {
    const idsInCart = new Set(lines.map((line) => line.product.id))
    return products
      .filter(
        (product) =>
          product.status === 'published' &&
          product.type === 'retail' &&
          !idsInCart.has(product.id),
      )
      .slice(0, 4)
  }, [products, lines])

  if (lines.length === 0) {
    return (
      <div className="container-fits">
        <div className="flex flex-col items-center py-20 text-center md:py-28">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ShoppingBag className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
            Tu carrito está vacío.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Añade tus esenciales favoritos y coordina el pedido por WhatsApp. Solo
            mostramos productos publicados por la dueña.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/tienda" className={buttonVariants({ variant: 'primary' })}>
              Explorar tienda
            </Link>
            <Link to="/mayor" className={buttonVariants({ variant: 'secondary' })}>
              Ver al mayor
            </Link>
          </div>
        </div>

        {recommendations.length > 0 ? (
          <section className="border-t border-border-subtle py-12">
            <p className="label-kicker">Quizá te interese</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">
              Empieza por estos esenciales.
            </h2>
            <div className="mt-6">
              <ProductGrid products={recommendations} />
            </div>
          </section>
        ) : null}
      </div>
    )
  }

  return (
    <div className="section-pad">
      <div className="container-fits">
        <nav className="breadcrumb" aria-label="Migas de pan">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Carrito</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label-kicker">Tu selección</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              Carrito.
            </h1>
            <p className="mt-2 text-sm text-muted">
              {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} · Imágenes de
              referencia
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted underline underline-offset-2 hover:text-error"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Vaciar carrito
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
          <section aria-label="Productos en el carrito">
            <ul className="divide-y divide-border-subtle border-y border-border-subtle">
              {lines.map((line) => {
                const isWholesale = line.product.type === 'wholesale'
                return (
                  <li
                    key={`${line.product.id}-${line.size}`}
                    className="grid grid-cols-[92px_1fr] gap-4 py-5 sm:grid-cols-[120px_1fr] sm:gap-5"
                  >
                    <Link
                      to={`/producto/${line.product.slug}`}
                      className="overflow-hidden rounded-lg border border-border-subtle bg-surface-strong"
                    >
                      <img
                        src={resolveImage(line.product.image)}
                        alt={line.product.name}
                        loading="lazy"
                        className="aspect-[4/5] h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                            {isWholesale
                              ? `Pack de ${line.product.packQuantity ?? 1} uds`
                              : line.product.category}
                          </p>
                          <Link
                            to={`/producto/${line.product.slug}`}
                            className="mt-1 block font-display text-base font-semibold leading-snug hover:text-primary sm:text-lg"
                          >
                            {line.product.name}
                          </Link>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                            {isWholesale ? 'Paquete completo' : `Talla ${line.size}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.product.id, line.size)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-error-bg hover:text-error"
                          aria-label={`Eliminar ${line.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                        <div>
                          <p className="mb-1 text-[10px] text-muted">Cantidad</p>
                          <QuantityStepper
                            value={line.quantity}
                            onChange={(value) =>
                              updateQuantity(line.product.id, line.size, value)
                            }
                            max={Math.max(1, Math.min(line.product.stock, 99))}
                          />
                          {line.quantity > line.product.stock ? (
                            <p className="mt-1 text-[10px] text-error">
                              Solo hay {line.product.stock} disponibles.
                            </p>
                          ) : null}
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-base font-semibold">
                            {formatPrice(line.lineTotal)}
                          </p>
                          <p className="text-[10px] text-muted">
                            {formatPrice(line.product.price)} c/u
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link
                to="/tienda"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Seguir comprando
              </Link>
              <span className="text-xs text-muted">
                Los productos despublicados se eliminan automáticamente.
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface p-4">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Envío por coordinar</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    El costo se confirma por WhatsApp según tu ciudad.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Pedido asistido</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Confirmamos stock, talla y pago antes de cerrar.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <h2 className="font-display text-xl font-semibold">Resumen del pedido</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-2">Subtotal</dt>
                  <dd className="font-mono font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-2">Envío</dt>
                  <dd className="text-xs text-muted">Por confirmar</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border-subtle pt-3">
                  <dt className="font-semibold">Total estimado</dt>
                  <dd className="font-display text-2xl font-semibold">{formatPrice(subtotal)}</dd>
                </div>
              </dl>

              <a
                href={whatsappUrl(site.whatsapp, buildOrderMessage(lines))}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'whatsapp', size: 'lg' }) + ' mt-5 w-full'}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Finalizar por WhatsApp
              </a>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
                Se abrirá WhatsApp con el resumen. Allí confirmas dirección, envío y forma
                de pago.
              </p>
              <div className="mt-4 rounded-md bg-surface-muted p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                  Número de la demo
                </p>
                <p className="mt-1 text-xs text-muted-2">{site.whatsappDisplay}</p>
                <Link
                  to="/admin/login"
                  className="mt-2 inline-block text-[11px] font-semibold text-primary underline underline-offset-2"
                >
                  Cambiar en el panel de la dueña
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {recommendations.length > 0 ? (
          <section className="mt-14 border-t border-border-subtle pt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label-kicker">Combina tu pedido</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">
                  También disponible.
                </h2>
              </div>
              <Link
                to="/tienda"
                className="text-sm font-semibold text-primary hover:text-primary-hover"
              >
                Ver todo
              </Link>
            </div>
            <div className="mt-6">
              <ProductGrid products={recommendations} />
            </div>
          </section>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="¿Vaciar el carrito?"
        description="Se quitarán todos los productos de tu selección. Esta acción no se puede deshacer."
        confirmLabel="Sí, vaciar"
        destructive
        onConfirm={clear}
      />
    </div>
  )
}
