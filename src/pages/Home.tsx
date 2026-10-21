import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  MessageCircle,
  MoveRight,
  Package,
  Ruler,
  Truck,
} from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductGrid'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/Accordion'
import { Badge } from '../components/ui/Badge'
import { buttonVariants } from '../components/ui/Button'
import { discountPercent, formatPrice } from '../lib/format'
import { resolveImage } from '../lib/images'
import { usePageTitle } from '../lib/usePageTitle'
import { useCatalog } from '../store/catalog'
import { useSite } from '../store/site'

const categories = [
  {
    name: 'Tops',
    description: 'Sujeción y libertad',
    image: '/img/feature-zapatillas.jpg',
    to: '/tienda?categoria=Tops',
  },
  {
    name: 'Leggings',
    description: 'Movimiento sin límites',
    image: '/img/offer-pack.jpg',
    to: '/tienda?categoria=Leggings',
  },
  {
    name: 'Conjuntos',
    description: 'Listos para todo',
    image: '/img/product-windbreaker.jpg',
    to: '/tienda?categoria=Conjuntos',
  },
  {
    name: 'Chaquetas',
    description: 'Tu capa esencial',
    image: '/img/offer-jacket.jpg',
    to: '/tienda?categoria=Chaquetas',
  },
]

export function Home() {
  usePageTitle()
  const products = useCatalog((state) => state.products)
  const site = useSite()

  const publishedRetail = useMemo(
    () => products.filter((product) => product.status === 'published' && product.type === 'retail'),
    [products],
  )

  const featured = useMemo(() => {
    const selected = publishedRetail.filter((product) => product.featured)
    return (selected.length >= 4 ? selected : publishedRetail).slice(0, 4)
  }, [publishedRetail])

  const bestOffer = useMemo(() => {
    return [...publishedRetail]
      .filter((product) => product.compareAtPrice)
      .sort(
        (a, b) =>
          (discountPercent(b.price, b.compareAtPrice) ?? 0) -
          (discountPercent(a.price, a.compareAtPrice) ?? 0),
      )[0]
  }, [publishedRetail])

  return (
    <>
      <section className="overflow-hidden border-b border-border-subtle">
        <div className="container-fits grid items-center gap-10 py-10 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-16 lg:py-20">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-soft px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Nueva colección / 01
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.8rem,7vw,5.2rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-foreground">
              Ropa que se mueve contigo.
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-2">
              Esenciales deportivos para entrenar, descansar y vivir a tu ritmo.
              Comodidad real, soporte suave y piezas que quieres repetir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/tienda"
                className={buttonVariants({ variant: 'primary', size: 'lg' })}
              >
                Comprar colección
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/mayor"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                Ver al mayor
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-border-subtle pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-2">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Compra coordinada por WhatsApp
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-2">
                <Ruler className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Guía de tallas disponible
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="absolute -right-2 top-8 hidden h-[72%] w-[78%] rounded-[20px] bg-primary-soft md:block" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[20px] border border-border bg-surface-strong shadow-[0_24px_70px_-38px_rgba(24,54,120,0.45)]">
              <img
                src={resolveImage('/img/product-compression.jpg')}
                alt="Conjunto deportivo FITS en tonos neutros"
                width="960"
                height="1200"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 rounded-lg bg-background/90 p-3 backdrop-blur">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                    Look 01
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">Conjunto Soft</p>
                </div>
                <span className="font-mono text-xs text-muted">Imagen de referencia</span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-lg border border-border bg-surface p-3 shadow-sm md:block">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                Hecho para
              </p>
              <p className="mt-0.5 text-sm font-semibold">moverse contigo</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle bg-surface">
        <div className="container-fits grid grid-cols-1 divide-y divide-border-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            {
              icon: Truck,
              title: 'Envíos coordinados',
              text: 'El costo se confirma por WhatsApp según tu ciudad.',
            },
            {
              icon: HeartHandshake,
              title: 'Atención real',
              text: 'Te ayudamos con tallas, combinaciones y reposición.',
            },
            {
              icon: Package,
              title: 'Detal y mayor',
              text: 'Compra para ti o surte tu tienda con packs.',
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 px-1 py-5 sm:px-6">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-fits">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label-kicker">Encuentra tu esencial</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                Empieza por aquí.
              </h2>
            </div>
            <Link
              to="/tienda"
              className="hidden items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover sm:inline-flex"
            >
              Ver todo
              <MoveRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.to}
                className="group relative overflow-hidden rounded-lg border border-border-subtle bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <img
                  src={resolveImage(category.image)}
                  alt={category.name}
                  loading="lazy"
                  width="600"
                  height="750"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1b20]/75 via-[#1a1b20]/20 to-transparent p-3 pt-12 text-white">
                  <p className="font-display text-base font-semibold">{category.name}</p>
                  <p className="mt-0.5 text-[11px] text-white/80">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-border-subtle bg-surface">
        <div className="container-fits">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label-kicker">Selección FITS</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                Favoritos de la semana.
              </h2>
            </div>
            <Link
              to="/tienda"
              className="hidden items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover sm:inline-flex"
            >
              Ver toda la tienda
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-7">
            <ProductGrid products={featured} className="lg:grid-cols-4" />
          </div>
        </div>
      </section>

      {bestOffer ? (
        <section className="section-pad">
          <div className="container-fits">
            <div className="overflow-hidden rounded-[20px] bg-primary text-white">
              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="flex flex-col justify-center p-7 md:p-12 lg:p-14">
                  <Badge className="w-fit border-white/20 bg-white/10 text-primary-soft">
                    Oferta activa
                  </Badge>
                  <h2 className="mt-5 max-w-md font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl">
                    Hasta −{discountPercent(bestOffer.price, bestOffer.compareAtPrice)}% en
                    esenciales.
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-soft">
                    Una selección corta para renovar tu semana sin pensarlo demasiado.
                    Disponible mientras haya stock.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <Link
                      to="/tienda?ofertas=1"
                      className={buttonVariants({ variant: 'whatsapp', size: 'lg' })}
                    >
                      Ver ofertas
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary-soft">
                      Desde {formatPrice(bestOffer.price)}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/producto/${bestOffer.slug}`}
                  className="relative min-h-64 overflow-hidden"
                  aria-label={`Ver ${bestOffer.name}`}
                >
                  <img
                    src={resolveImage(bestOffer.image)}
                    alt={bestOffer.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-pad border-y border-border-subtle bg-surface">
        <div className="container-fits grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative overflow-hidden rounded-[20px] border border-border-subtle">
            <img
              src={resolveImage('/img/offer-jacket.jpg')}
              alt="Chaquetas deportivas FITS"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover md:aspect-[5/4]"
            />
          </div>
          <div>
            <p className="label-kicker">Nuestra idea</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl">
              Hecho para el movimiento real.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-2">
              No necesitas ropa que grite. Necesitas piezas que se sientan bien, resistan
              el uso y te acompañen sin distraerte. FITS se construye alrededor de esa
              idea: menos ruido, más comodidad.
            </p>
            <div className="mt-7 grid max-w-md grid-cols-2 gap-4 border-t border-border-subtle pt-5">
              <div>
                <p className="font-display text-2xl font-semibold">01</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Tejidos cómodos y elásticos
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">02</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Diseño simple, uso diario
                </p>
              </div>
            </div>
            <Link
              to="/tienda"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Conoce la colección
              <MoveRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-fits overflow-hidden rounded-[20px] border border-primary/15 bg-primary-soft">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center p-7 md:p-12">
              <p className="label-kicker">Para tiendas y estudios</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-4xl">
                Surtí tu espacio con FITS.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-2">
                Packs seleccionados, precios por volumen y reposición coordinada por
                WhatsApp. Mantén tus tallas disponibles sin complicarte.
              </p>
              <Link
                to="/mayor"
                className={buttonVariants({ variant: 'primary', size: 'lg' })}
              >
                Ver catálogo al mayor
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="relative min-h-64 overflow-hidden">
              <img
                src={resolveImage('/img/offer-pack.jpg')}
                alt="Packs de leggings para venta al mayor"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border-subtle bg-surface">
        <div className="container-fits grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="label-kicker">Antes de comprar</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
              Preguntas frecuentes.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Si tienes dudas sobre tallas, envíos o pedidos al mayor, escríbenos.
            </p>
            <a
              href={`https://wa.me/${site.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Hablar por WhatsApp
            </a>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="como-comprar">
              <AccordionTrigger>¿Cómo compro?</AccordionTrigger>
              <AccordionContent>
                Elige tus productos, añádelos al carrito y completa el pedido por
                WhatsApp. Te confirmamos disponibilidad, talla y costo de envío.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tallas">
              <AccordionTrigger>¿Cómo elijo mi talla?</AccordionTrigger>
              <AccordionContent>
                Cada producto tiene sus tallas disponibles. En la página de ayuda
                encuentras una guía rápida; si sigues con dudas, escríbenos y te
                orientamos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="envios">
              <AccordionTrigger>¿Hacen envíos?</AccordionTrigger>
              <AccordionContent>
                Coordinamos el envío por WhatsApp según tu ciudad. El costo y el tiempo
                se confirman antes de cerrar el pedido.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="mayor">
              <AccordionTrigger>¿Puedo comprar al mayor?</AccordionTrigger>
              <AccordionContent>
                Sí. En la sección Al Mayor encuentras packs con cantidad de unidades y
                precio por paquete. También puedes solicitar una combinación a medida.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="section-pad border-t border-border-subtle">
        <div className="container-fits flex flex-col items-center rounded-[20px] border border-border-subtle bg-surface px-6 py-12 text-center md:py-16">
          <p className="label-kicker">Tu próximo esencial</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl">
            Encuentra lo que te haga sentir lista.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Detal, mayor y atención directa. Sin vueltas.
          </p>
          <Link
            to="/tienda"
            className={buttonVariants({ variant: 'primary', size: 'lg' })}
          >
            Ir a la tienda
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
