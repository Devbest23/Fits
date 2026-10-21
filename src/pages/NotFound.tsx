import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '../components/ui/Button'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFound() {
  usePageTitle('Página no encontrada')

  return (
    <div className="container-fits flex flex-col items-center py-20 text-center md:py-28">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
        Error 404
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
        Esta página no existe.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Puede que el enlace haya cambiado o que la página ya no esté disponible. Vuelve al
        inicio o explora la tienda.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className={buttonVariants({ variant: 'primary' })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al inicio
        </Link>
        <Link to="/tienda" className={buttonVariants({ variant: 'secondary' })}>
          Explorar tienda
        </Link>
      </div>
    </div>
  )
}
