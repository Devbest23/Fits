import {
  CreditCard,
  Mail,
  MessageCircle,
  Package,
  RefreshCcw,
  Ruler,
  Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/Accordion'
import { buttonVariants } from '../components/ui/Button'
import { whatsappUrl } from '../lib/order'
import { usePageTitle } from '../lib/usePageTitle'
import { useSite } from '../store/site'

const sizeRows = [
  { size: 'XS', chest: '78–82', waist: '60–64', hip: '86–90' },
  { size: 'S', chest: '82–86', waist: '64–68', hip: '90–94' },
  { size: 'M', chest: '86–90', waist: '68–72', hip: '94–98' },
  { size: 'L', chest: '90–96', waist: '72–78', hip: '98–104' },
  { size: 'XL', chest: '96–102', waist: '78–84', hip: '104–110' },
]

export function Help() {
  usePageTitle('Ayuda')
  const site = useSite()

  return (
    <div className="section-pad">
      <div className="container-fits">
        <nav className="breadcrumb" aria-label="Migas de pan">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Ayuda</span>
        </nav>

        <header className="mt-5 max-w-2xl">
          <p className="label-kicker">Estamos para ayudarte</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Todo claro antes de comprar.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-2">
            Tallas, envíos, cambios y pedidos al mayor. Si algo no está aquí, escríbenos
            por WhatsApp y te respondemos directo.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <section id="faq" className="scroll-mt-28" aria-labelledby="faq-title">
              <h2
                id="faq-title"
                className="font-display text-2xl font-semibold tracking-[-0.03em]"
              >
                Preguntas frecuentes
              </h2>
              <Accordion type="single" collapsible className="mt-4 border-t border-border-subtle">
                <AccordionItem value="comprar">
                  <AccordionTrigger>¿Cómo hago un pedido?</AccordionTrigger>
                  <AccordionContent>
                    Elige tus productos, selecciona la talla y añádelos al carrito. Al
                    finalizar, se abre WhatsApp con el resumen del pedido. Allí confirmamos
                    disponibilidad, envío y forma de pago.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pago">
                  <AccordionTrigger>¿Qué formas de pago aceptan?</AccordionTrigger>
                  <AccordionContent>
                    Las formas de pago se confirman por WhatsApp antes de cerrar el pedido.
                    En la versión final se publicarán aquí los métodos habilitados y sus
                    condiciones.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="envio">
                  <AccordionTrigger>¿Cómo se calcula el envío?</AccordionTrigger>
                  <AccordionContent>
                    El costo depende de tu ciudad y del tamaño del pedido. Te damos el monto
                    exacto por WhatsApp antes de confirmar. No cobramos un envío estimado
                    automático en la demo.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cambios">
                  <AccordionTrigger>¿Puedo cambiar una talla?</AccordionTrigger>
                  <AccordionContent>
                    Revisamos los cambios caso por caso. Escríbenos dentro de las primeras
                    48 horas de recibido el pedido, conservando las etiquetas y el empaque.
                    La disponibilidad depende del stock publicado.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="mayor">
                  <AccordionTrigger>¿Cómo funciona la venta al mayor?</AccordionTrigger>
                  <AccordionContent>
                    Cada pack indica cuántas unidades incluye y su precio total. Puedes
                    añadirlo al carrito o consultarnos por WhatsApp si necesitas una
                    combinación específica de tallas o tonos.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stock">
                  <AccordionTrigger>¿Por qué no veo un producto que vi antes?</AccordionTrigger>
                  <AccordionContent>
                    La tienda muestra únicamente los productos publicados por la dueña. Si
                    un producto se despublica o se agota, deja de estar disponible para
                    comprar.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section id="tallas" className="mt-12 scroll-mt-28" aria-labelledby="sizes-title">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2
                  id="sizes-title"
                  className="font-display text-2xl font-semibold tracking-[-0.03em]"
                >
                  Guía de tallas
                </h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Medidas de referencia en centímetros. Si estás entre dos tallas, elige la
                mayor para un ajuste más cómodo.
              </p>
              <div className="mt-4 overflow-x-auto rounded-lg border border-border-subtle">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Guía de tallas FITS con medidas de busto, cintura y cadera
                  </caption>
                  <thead className="bg-surface-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        Talla
                      </th>
                      <th scope="col" className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        Busto
                      </th>
                      <th scope="col" className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        Cintura
                      </th>
                      <th scope="col" className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        Cadera
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle bg-surface">
                    {sizeRows.map((row) => (
                      <tr key={row.size}>
                        <th scope="row" className="px-4 py-3 font-mono text-xs font-semibold">
                          {row.size}
                        </th>
                        <td className="px-4 py-3 text-muted-2">{row.chest} cm</td>
                        <td className="px-4 py-3 text-muted-2">{row.waist} cm</td>
                        <td className="px-4 py-3 text-muted-2">{row.hip} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted">
                Medidas de referencia de la demo. Deben validarse con las prendas reales
                antes de publicar.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="process-title">
              <h2
                id="process-title"
                className="font-display text-2xl font-semibold tracking-[-0.03em]"
              >
                Cómo comprar
              </h2>
              <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { title: 'Elige', text: 'Selecciona tus productos y tallas.' },
                  { title: 'Revisa', text: 'Confirma tu carrito y el total estimado.' },
                  { title: 'Coordina', text: 'Envía el pedido por WhatsApp.' },
                ].map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-lg border border-border-subtle bg-surface p-4"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
                      0{index + 1}
                    </span>
                    <p className="mt-2 font-display text-lg font-semibold">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{step.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside id="contacto" className="scroll-mt-28">
            <div className="rounded-xl border border-border-subtle bg-surface p-5 lg:sticky lg:top-24">
              <p className="label-kicker">Contacto directo</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">
                Hablemos.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                La forma más rápida de resolver dudas es por WhatsApp.
              </p>
              <a
                href={whatsappUrl(
                  site.whatsapp,
                  'Hola FITS. Tengo una pregunta sobre un producto de la tienda.',
                )}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'whatsapp', size: 'md' }) + ' mt-4 w-full'}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Escribir por WhatsApp
              </a>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Enviar un correo
              </a>
              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                {site.whatsappDisplay}
              </p>

              <div className="mt-5 space-y-3 border-t border-border-subtle pt-4">
                {[
                  { icon: Truck, title: 'Envíos', text: 'Coordinados por WhatsApp.' },
                  { icon: RefreshCcw, title: 'Cambios', text: 'Revisión caso por caso.' },
                  { icon: CreditCard, title: 'Pago', text: 'Confirmado al cerrar el pedido.' },
                  { icon: Package, title: 'Mayor', text: 'Packs y reposición.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-2.5">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-[11px] leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-md bg-primary-soft p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                  Nota de la demo
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-2">
                  El WhatsApp, correo y políticas son placeholders. La dueña podrá
                  actualizarlos desde el panel antes de publicar.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
