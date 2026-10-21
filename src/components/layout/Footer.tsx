import { ArrowUpRight, AtSign, LockKeyhole, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LOGO_SRC } from '../../lib/images'
import { whatsappUrl } from '../../lib/order'
import { useSite } from '../../store/site'

export function Footer() {
  const site = useSite()

  return (
    <footer className="mt-auto border-t border-border-subtle bg-surface-lowest">
      <div className="container-fits grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-16">
        <div>
          <img src={LOGO_SRC} alt="FITS basic and sport" className="h-11 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-2">
            Esenciales deportivos para mujeres que entrenan, se mueven y viven a su
            ritmo. Diseño simple, comodidad real.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            Prototipo · Imágenes de referencia
          </p>
        </div>

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            Tienda
          </h2>
          <div className="mt-4 flex flex-col gap-2.5">
            <Link to="/tienda" className="footer-link">
              Al detal
            </Link>
            <Link to="/mayor" className="footer-link">
              Al mayor
            </Link>
            <Link to="/ayuda" className="footer-link">
              Guía de tallas
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            Ayuda
          </h2>
          <div className="mt-4 flex flex-col gap-2.5">
            <Link to="/ayuda" className="footer-link">
              Envíos y cambios
            </Link>
            <Link to="/ayuda#faq" className="footer-link">
              Preguntas frecuentes
            </Link>
            <Link to="/ayuda#contacto" className="footer-link">
              Contacto
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            Hablemos
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-2">
            Coordinamos pedidos, tallas y envíos por WhatsApp.
          </p>
          <a
            href={whatsappUrl(
              site.whatsapp,
              'Hola FITS. Quiero consultar por los productos de la tienda.',
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-whatsapp px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Escribir por WhatsApp
          </a>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
            {site.whatsappDisplay}
          </p>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="container-fits flex flex-col gap-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FITS. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <AtSign className="h-3.5 w-3.5" aria-hidden="true" />
              Instagram
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary-hover"
            >
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
              Panel de la dueña
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
