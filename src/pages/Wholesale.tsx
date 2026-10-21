import {
  ArrowRight,
  Check,
  MessageCircle,
  PackageCheck,
  Percent,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductGrid'
import { Badge } from '../components/ui/Badge'
import { buttonVariants } from '../components/ui/Button'
import { formatPrice } from '../lib/format'
import { resolveImage } from '../lib/images'
import { whatsappUrl } from '../lib/order'
import { usePageTitle } from '../lib/usePageTitle'
import { useCatalog } from '../store/catalog'
import { useSite } from '../store/site'

const benefits = [
  {
    icon: Percent,
    title: 'Precio por paquete',
    text: 'Cada pack muestra la cantidad de unidades y el precio total. Sin sorpresas.',
  },
  {
    icon: PackageCheck,
    title: 'Surtido seleccionado',
    text: 'Combinamos tallas y tonos para que tu exhibición se vea completa.',
  },
  {
    icon: Truck,
    title: 'Reposición coordinada',
    text: 'Escríbenos por WhatsApp para confirmar disponibilidad y envío.',
  },
]

const steps = [
  {
    title: 'Elige tu pack',
    text: 'Revisa las unidades, tallas y precio de cada paquete publicado.',
  },
  {
    title: 'Confirma por WhatsApp',
    text: 'Te confirmamos stock, forma de pago y costo de envío a tu ciudad.',
  },
  {
    title: 'Recibe y exhibe',
    text: 'Preparamos tu pedido y coordinamos la entrega contigo.',
  },
]

export function Wholesale() {
  usePageTitle('Al mayor')
  const products = useCatalog((state) => state.products)
  const site = useSite()

  const packs = useMemo(
    () =>
      products.filter(
        (product) => product.status === 'published' && product.type === 'wholesale',
      ),
    [products],
  )

  const lowestPack = useMemo(
    () => [...packs].sort((a, b) => a.price - b.price)[0],
    [packs],
  )

  return (
    <>
      <section className="overflow-hidden border-b border-border-subtle bg-primary text-white">
        <div className="container-fits grid items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:py-20">
          <div>
            <nav className="breadcrumb breadcrumb-light" aria-label="Migas de pan">
              <Link to="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Al mayor</span>
            </nav>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary-soft">
              <ShoppingBag className="h-3 w-3" aria-hidden="true" />
              Venta al mayor
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              Surtí tu tienda con FITS.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-primary-soft">
              Packs listos para exhibir, reposición coordinada y atención directa.
              Compra por volumen sin complicarte con mil proveedores.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl(
                  site.whatsapp,
                  'Hola FITS. Quiero información sobre la venta al mayor y los packs disponibles.',
                )}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'whatsapp', size: 'lg' })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Consultar por WhatsApp
              </a>
              <a
                href="#packs"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
                style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}
              >
                Ver packs
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            {lowestPack ? (
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-primary-soft">
                Packs desde {formatPrice(lowestPack.price)} ·{' '}
                {lowestPack.packQuantity ?? 1} unidades
              </p>
            ) : null}
          </div>

          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="absolute -left-4 -top-4 hidden h-24 w-24 rounded-full border border-white/20 md:block" aria-hidden="true" />
            <div className="overflow-hidden rounded-[20px] border border-white/15">
              <img
                src={resolveImage('/img/offer-pack.jpg')}
                alt="Packs de leggings FITS para venta al mayor"
                width="900"
                height="1125"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-background/95 p-4 text-foreground backdrop-blur">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                Pack destacado
              </p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <p className="font-display text-lg font-semibold">
                  {packs[0]?.name ?? 'Packs FITS'}
                </p>
                <span className="font-mono text-xs text-muted">
                  {packs[0] ? `${packs[0].packQuantity ?? 1} uds` : 'Consultar'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle bg-surface">
        <div className="container-fits grid divide-y divide-border-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3 px-1 py-6 sm:px-6">
              <benefit.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{benefit.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="packs" className="section-pad">
        <div className="container-fits">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="label-kicker">Catálogo al mayor</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
                Packs publicados.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-2">
                Solo aparecen aquí los packs que la dueña publicó. Cada precio corresponde
                al paquete completo.
              </p>
            </div>
            <Badge variant="primary" className="w-fit">
              {packs.length} packs disponibles
            </Badge>
          </div>

          {packs.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
              <PackageCheck className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl font-semibold">
                No hay packs publicados por ahora.
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                Escríbenos por WhatsApp para conocer la próxima reposición.
              </p>
              <a
                href={whatsappUrl(
                  site.whatsapp,
                  'Hola FITS. Quiero consultar por la próxima reposición al mayor.',
                )}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'whatsapp' })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Consultar reposición
              </a>
            </div>
          ) : (
            <div className="mt-8">
              <ProductGrid products={packs} priorityFirst />
            </div>
          )}
        </div>
      </section>

      <section className="section-pad border-y border-border-subtle bg-surface">
        <div className="container-fits grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="label-kicker">Cómo funciona</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
              De tu consulta a tu vitrina.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Sin formularios largos ni procesos confusos. Tú eliges el pack y nosotras
              coordinamos el resto.
            </p>
          </div>

          <ol className="space-y-0">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-border-subtle py-5 first:pt-0 last:border-0"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft font-mono text-xs font-semibold text-primary">
                  0{index + 1}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-fits overflow-hidden rounded-[20px] border border-primary/15 bg-primary-soft">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 md:p-12">
              <p className="label-kicker">¿Necesitas algo específico?</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-4xl">
                Armamos una selección contigo.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-2">
                Cuéntanos qué tallas, tonos o cantidades necesitas. Te enviamos una
                propuesta de pack y coordinamos la disponibilidad.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  'Atención directa con la dueña',
                  'Precios por volumen',
                  'Coordinación de envío por WhatsApp',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-2">
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappUrl(
                  site.whatsapp,
                  'Hola FITS. Quiero armar un pack al mayor con tallas y colores específicos.',
                )}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'primary', size: 'lg' })}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Hablar con FITS
              </a>
            </div>
            <div className="relative min-h-56 overflow-hidden">
              <img
                src={resolveImage('/img/product-windbreaker.jpg')}
                alt="Conjunto deportivo para exhibición mayorista"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
