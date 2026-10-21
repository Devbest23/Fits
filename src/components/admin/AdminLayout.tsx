import {
  ArrowUpRight,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  Store,
} from 'lucide-react'
import { useState, Suspense } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useAuth } from '../../store/auth'
import { PageLoader } from '../layout/PageLoader'

const navigation = [
  { label: 'Resumen', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Productos', to: '/admin/productos', icon: Package, end: false },
  { label: 'Ajustes', to: '/admin/ajustes', icon: Settings, end: false },
]

export function AdminLayout() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const logout = useAuth((state) => state.logout)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-[#F2F1F6] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-primary text-white lg:flex">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#1a1b20]/60 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <aside className="relative flex h-full w-[280px] flex-col bg-primary text-white shadow-2xl">
            <SidebarContent
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border-subtle bg-background px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-surface-strong"
            aria-label="Abrir menú del panel"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <p className="font-display text-sm font-semibold">Panel de la dueña</p>
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-surface-strong"
            aria-label="Ver tienda"
          >
            <Store className="h-5 w-5" aria-hidden="true" />
          </Link>
        </header>

        <div className="flex items-center justify-center gap-2 border-b border-primary/10 bg-primary-soft/60 px-4 py-2 text-center">
          <FlaskConical className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
            Modo demo local · Los cambios se guardan en este navegador
          </p>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void
  onNavigate?: () => void
}) {
  return (
    <>
      <div className="flex items-start justify-between border-b border-white/10 px-5 py-5">
        <Link
          to="/admin"
          onClick={onNavigate}
          className="flex flex-col rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary"
        >
          <span className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
            FITS
          </span>
          <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-primary-soft">
            Basic and sport
          </span>
        </Link>
        <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-primary-soft">
          Admin
        </span>
      </div>

      <div className="px-5 py-5">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-primary-soft/70">
          Panel de la dueña
        </p>
        <p className="mt-1 text-sm font-semibold text-white">Gestiona tu tienda</p>
      </div>

      <nav className="flex flex-col gap-1 px-3" aria-label="Navegación del panel">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                isActive
                  ? 'bg-white/12 text-white'
                  : 'text-primary-soft/85 hover:bg-white/8 hover:text-white',
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 p-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-primary-soft/85 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          Ver tienda
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm text-primary-soft/85 transition-colors hover:bg-white/8 hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
        <div className="mt-3 flex items-start gap-2 rounded-md bg-white/5 p-3">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-soft" aria-hidden="true" />
          <p className="text-[10px] leading-relaxed text-primary-soft/75">
            Demo local. En producción, la autenticación se validará en la API.
          </p>
        </div>
      </div>
    </>
  )
}
