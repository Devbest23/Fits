import {
  ArrowLeft,
  Check,
  ChevronRight,
  MessageCircle,
  Package,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductGrid'
import { QuantityStepper } from '../components/product/QuantityStepper'
import { SizeSelector } from '../components/product/SizeSelector'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/Accordion'
import { Badge } from '../components/ui/Badge'
import { Button, buttonVariants } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'
import { discountPercent, formatPrice } from '../lib/format'
import { resolveImage } from '../lib/images'
import { buildProductInquiry, whatsappUrl } from '../lib/order'
import { usePageTitle } from '../lib/usePageTitle'
import { useCart } from '../store/cart'
import { useCatalog } from '../store/catalog'
import { useSite } from '../store/site'
import { useUI } from '../store/ui'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const products = useCatalog((state) => state.products)
  const addItem = useCart((state) => state.addItem)
  const openCart = useUI((state) => state.openCart)
  const site = useSite()
  const { toast } = useToast()

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  const product = useMemo(
    () =>
      products.find(
        (candidate) => candidate.slug === slug && candidate.status === 'published',
      ),
    [products, slug],
  )

  usePageTitle(product?.name ?? 'Producto no disponible')

  useEffect(() => {
    setSelectedSize(null)
    setQuantity(1)
    setSizeError(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter(
        (candidate) =>
          candidate.id !== product.id &&
          candidate.status === 'published' &&
          candidate.type === product.type &&
          candidate.category === product.category,
      )
      .slice(0, 4)
  }, [products, product])

  if (!product) {
    return <ProductUnavailable />
  }

  const isWholesale = product.type === 'wholesale'
  const soldOut = product.stock <= 0
  const discount = discountPercent(product.price, product.compareAtPrice)
  const maxQuantity = Math.max(1, Math.min(product.stock, 99))

  function handleAdd() {
    if (!product) return

    if (soldOut) {
      toast({
        variant: 'error',
        title: 'Producto agotado',
        description: 'Escríbenos por WhatsApp para consultar la próxima reposición.',
      })
      return
    }

    if (!isWholesale && !selectedSize) {
      setSizeError(true)
      return
    }

    addItem(product.id, isWholesale ? 'PAQUETE' : selectedSize!, quantity)
    setSizeError(false)
    toast({
      variant: 'success',
      title: 'Añadido al carrito',
      description: `${product.name} · ${isWholesale ? 'paquete' : `talla ${selectedSize}`} × ${quantity}`,
    })
    openCart()
  }

  return (
    <div className="pb-24 md:pb-0">
      <div className="container-fits pt-6">
        <nav className="breadcrumb" aria-label="Migas de pan">
          <Link to="/">Inicio</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <Link to={isWholesale ? '/mayor' : '/tienda'}>
            {isWholesale ? 'Al mayor' : 'Tienda'}
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span aria-current="page">{product.name}</span>
        </nav>
      </div>

      <div className="container-fits grid gap-8 py-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-12 lg:gap-16">
        <div>
          <div className="relative overflow-hidden rounded-[20px] border border-border-subtle bg-surface-strong">
            <img
              src={resolveImage(product.image)}
              alt={product.name}
              width="1000"
              height="1250"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
              {soldOut ? <Badge variant="neutral">Agotado</Badge> : null}
              {!soldOut && discount ? <Badge variant="error">−{discount}%</Badge> : null}
              {isWholesale ? <Badge variant="primary">Al mayor</Badge> : null}
              {product.featured && !isWholesale ? (
                <Badge variant="primary">Favorito</Badge>
              ) : null}
            </div>
            <div className="absolute bottom-4 right-4 rounded-full bg-background/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted backdrop-blur">
              Imagen de referencia
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: 'Envío coordinado' },
              { icon: ShieldCheck, text: 'Compra segura' },
              { icon: Package, text: 'Detal y mayor' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-2 py-3 text-center"
              >
                <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-[10px] leading-tight text-muted">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            {isWholesale ? 'Venta al mayor' : product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-2xl font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="font-mono text-sm text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
            {isWholesale && product.packQuantity ? (
              <span className="text-sm text-muted">
                · {formatPrice(product.price / product.packQuantity)} por unidad
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-xs text-muted">
            {isWholesale
              ? `Precio por paquete de ${product.packQuantity ?? 1} unidades.`
              : 'Precio en USD. El envío se confirma por WhatsApp.'}
          </p>

          <p className="mt-5 text-[15px] leading-relaxed text-muted-2">
            {product.description}
          </p>

          <div className="mt-6 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${soldOut ? 'bg-error' : 'bg-success'}`}
              aria-hidden="true"
            />
            <p className="text-sm font-medium">
              {soldOut
                ? 'Agotado por ahora'
                : product.stock <= 5
                  ? `Últimas ${product.stock} unidades`
                  : 'Disponible para pedido'}
            </p>
          </div>

          <div className="mt-6 border-t border-border-subtle pt-6">
            {isWholesale ? (
              <div className="rounded-lg border border-primary/15 bg-primary-soft p-4">
                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Paquete de {product.packQuantity ?? 1} unidades
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-2">
                      Incluye surtido de tallas seleccionado por FITS. Si necesitas una
                      combinación específica, consúltanos por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold">Talla</p>
                  <Link
                    to="/ayuda#tallas"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                    Guía de tallas
                  </Link>
                </div>
                <SizeSelector
                  sizes={product.sizes}
                  value={selectedSize}
                  onChange={(size) => {
                    setSelectedSize(size)
                    setSizeError(false)
                  }}
                />
                {sizeError ? (
                  <p className="mt-2 text-xs font-medium text-error" role="alert">
                    Selecciona una talla antes de añadir al carrito.
                  </p>
                ) : null}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold">Cantidad</p>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={maxQuantity}
                  disabled={soldOut}
                />
              </div>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAdd}
                disabled={soldOut}
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {soldOut ? 'Agotado' : 'Añadir al carrito'}
              </Button>
            </div>

            <a
              href={whatsappUrl(site.whatsapp, buildProductInquiry(product))}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: 'whatsapp', size: 'md' }) }
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Consultar por WhatsApp
            </a>

            <ul className="mt-5 grid gap-2 text-xs text-muted">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Puedes combinar productos en un solo pedido.
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Confirmamos talla, stock y envío antes de cerrar.
              </li>
            </ul>
          </div>

          <Accordion type="single" collapsible className="mt-4 border-t border-border-subtle">
            <AccordionItem value="detalles">
              <AccordionTrigger>Detalles del producto</AccordionTrigger>
              <AccordionContent>
                <p>{product.description}</p>
                <p className="mt-2">
                  Categoría: {product.category}. {isWholesale ? 'Venta por paquete.' : 'Venta al detal.'}{' '}
                  Las imágenes son de referencia; el tono puede variar según la pantalla.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="envios">
              <AccordionTrigger>Envíos y cambios</AccordionTrigger>
              <AccordionContent>
                Coordinamos el envío por WhatsApp según tu ciudad. Los cambios se revisan
                caso por caso; escríbenos dentro de las primeras 48 horas de recibido el
                pedido. Esta es una demo: las políticas finales se publicarán con los datos
                reales del negocio.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cuidado">
              <AccordionTrigger>Cuidado de la prenda</AccordionTrigger>
              <AccordionContent>
                Lavar a mano o en ciclo suave con agua fría. No usar blanqueador. Secar a la
                sombra. Evitar secadora para conservar la elasticidad.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="section-pad border-t border-border-subtle bg-surface">
          <div className="container-fits">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label-kicker">También te puede gustar</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                  Completa tu selección.
                </h2>
              </div>
              <Link
                to={isWholesale ? '/mayor' : '/tienda'}
                className="hidden text-sm font-semibold text-primary hover:text-primary-hover sm:inline-flex"
              >
                Ver catálogo
              </Link>
            </div>
            <div className="mt-6">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface p-3 md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0">
            <p className="font-mono text-base font-semibold">{formatPrice(product.price)}</p>
            <p className="truncate text-[10px] text-muted">
              {isWholesale
                ? `Pack de ${product.packQuantity ?? 1} uds`
                : selectedSize
                  ? `Talla ${selectedSize}`
                  : 'Elige tu talla'}
            </p>
          </div>
          <Button className="flex-1" onClick={handleAdd} disabled={soldOut}>
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {soldOut ? 'Agotado' : 'Añadir'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProductUnavailable() {
  return (
    <div className="container-fits flex flex-col items-center py-20 text-center md:py-28">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Package className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
        Este producto no está disponible.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Puede que la dueña lo haya despublicado o que el enlace ya no exista. Solo se
        pueden comprar los productos publicados desde el panel.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/tienda" className={buttonVariants({ variant: 'primary' })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a la tienda
        </Link>
        <Link to="/mayor" className={buttonVariants({ variant: 'secondary' })}>
          Ver al mayor
        </Link>
      </div>
    </div>
  )
}
