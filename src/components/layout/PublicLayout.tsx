import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { PageLoader } from './PageLoader'

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>

      <div className="border-b border-primary/10 bg-primary-soft/60">
        <div className="container-fits flex flex-col items-center justify-center gap-1 py-2 text-center sm:flex-row">
          <p className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
            <FlaskConical className="h-3 w-3" aria-hidden="true" />
            Prototipo navegable · Admin local
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary underline underline-offset-2 hover:text-primary-hover"
          >
            Probar el panel de la dueña
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Header />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
