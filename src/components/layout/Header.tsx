import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { Menu, Search, ShoppingBag, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LOGO_SRC } from '../../lib/images'
import { cn } from '../../lib/cn'
import { useCartCount } from '../../store/cart'
import { useUI } from '../../store/ui'
import { useSite } from '../../store/site'
import { DialogContent as StyledDialogContent } from '../ui/Dialog'
import { Button, buttonVariants } from '../ui/Button'

const navItems = [
  { label: 'Tienda', to: '/tienda' },
  { label: 'Al Mayor', to: '/mayor' },
  { label: 'Ayuda', to: '/ayuda' },
]

export function Header() {
  const cartCount = useCartCount()
  const openCart = useUI((state) => state.openCart)
  const announcement = useSite((state) => state.announcement)

  return (
    <>
      <div className="border-b border-primary/10 bg-primary text-white">
        <div className="container-fits flex min-h-9 items-center justify-center gap-2 py-2 text-center">
          <Sparkles className="h-3.5 w-3.5 text-primary-soft-2" aria-hidden="true" />
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary-soft">
            {announcement}
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/95 backdrop-blur">
        <div className="container-fits flex h-16 items-center justify-between gap-3 md:h-[72px]">
          <div className="flex items-center gap-1 md:hidden">
            <MobileMenu />
          </div>

          <Link
            to="/"
            className="flex shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            aria-label="FITS — Inicio"
          >
            <img src={LOGO_SRC} alt="FITS basic and sport" className="h-9 w-auto md:h-10" />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative py-2 text-sm font-medium text-muted-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4',
                    isActive &&
                      'text-primary after:absolute after:inset-x-0 after:-bottom-[15px] after:h-0.5 after:bg-primary',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <Link
              to="/tienda"
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Buscar productos"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Abrir carrito${cartCount ? `, ${cartCount} artículos` : ''}`}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[9px] font-semibold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <StyledDialogContent title="Menú" side="left">
        <div className="flex h-full flex-col p-5">
          <nav className="flex flex-col" aria-label="Navegación móvil">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'border-b border-border-subtle py-4 font-display text-2xl font-semibold tracking-tight',
                    isActive ? 'text-primary' : 'text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-lg bg-surface-muted p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Panel de la dueña
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-2">
              Solo la dueña puede cargar y publicar productos.
            </p>
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'mt-3 w-full')}
            >
              Entrar al panel
            </Link>
          </div>

          <Button
            variant="ghost"
            className="mt-auto justify-start"
            onClick={() => setOpen(false)}
          >
            Cerrar menú
          </Button>
        </div>
      </StyledDialogContent>
    </Dialog>
  )
}
