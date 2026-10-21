import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  Download,
  Eye,
  EyeOff,
  Package,
  PackagePlus,
  RotateCcw,
  Settings,
  ShoppingBag,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge, TypeBadge } from '../../components/admin/ProductBadges'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useToast } from '../../components/ui/Toast'
import { formatDate, formatPrice } from '../../lib/format'
import { resolveImage } from '../../lib/images'
import { usePageTitle } from '../../lib/usePageTitle'
import { useCatalog } from '../../store/catalog'
import { useSite } from '../../store/site'

export function AdminDashboard() {
  usePageTitle('Resumen')
  const products = useCatalog((state) => state.products)
  const resetDemo = useCatalog((state) => state.resetDemo)
  const resetSettings = useSite((state) => state.resetSettings)
  const { toast } = useToast()
  const [confirmReset, setConfirmReset] = useState(false)

  const stats = useMemo(() => {
    const published = products.filter((product) => product.status === 'published').length
    const drafts = products.length - published
    const lowStock = products.filter(
      (product) => product.status === 'published' && product.stock <= 5,
    ).length
    const retail = products.filter((product) => product.type === 'retail').length
    const wholesale = products.length - retail
    const units = products.reduce((total, product) => total + product.stock, 0)
    return { published, drafts, lowStock, retail, wholesale, units }
  }, [products])

  const recent = useMemo(
    () =>
      [...products]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [products],
  )

  function handleReset() {
    resetDemo()
    resetSettings()
    toast({
      variant: 'info',
      title: 'Demo reiniciada',
      description: 'El catálogo y los ajustes volvieron a su estado inicial.',
    })
  }

  function exportCatalog() {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'fits-catalogo-demo.json'
    anchor.click()
    URL.revokeObjectURL(url)
    toast({
      variant: 'success',
      title: 'Catálogo exportado',
      description: 'El archivo JSON servirá para migrar los datos a la API.',
    })
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            Panel de la dueña
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Resumen de tu tienda.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Aquí controlas qué se vende. Las clientas solo ven los productos publicados.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportCatalog}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Exportar
          </Button>
          <Link
            to="/admin/productos/nuevo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <PackagePlus className="h-4 w-4" aria-hidden="true" />
            Nuevo producto
          </Link>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Productos"
          value={products.length}
          hint={`${stats.retail} al detal · ${stats.wholesale} al mayor`}
          icon={Package}
        />
        <StatCard
          label="Publicados"
          value={stats.published}
          hint="Visibles para las clientas"
          icon={Eye}
          tone="success"
        />
        <StatCard
          label="Borradores"
          value={stats.drafts}
          hint="Solo visibles en el panel"
          icon={EyeOff}
          tone="warning"
        />
        <StatCard
          label="Stock bajo"
          value={stats.lowStock}
          hint="Publicados con 5 unidades o menos"
          icon={AlertTriangle}
          tone={stats.lowStock > 0 ? 'error' : 'neutral'}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Actividad reciente</h2>
              <p className="mt-0.5 text-xs text-muted">Últimos productos modificados</p>
            </div>
            <Link
              to="/admin/productos"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
            >
              Ver todos
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Package className="mx-auto h-7 w-7 text-muted" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold">Todavía no hay productos.</p>
              <p className="mt-1 text-xs text-muted">
                Crea el primero para que aparezca en la tienda al publicarlo.
              </p>
              <Link
                to="/admin/productos/nuevo"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white"
              >
                <PackagePlus className="h-4 w-4" aria-hidden="true" />
                Crear producto
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-surface-muted text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em]">
                      Producto
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em]">
                      Tipo
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em]">
                      Precio
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em]">
                      Estado
                    </th>
                    <th scope="col" className="px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.1em]">
                      Actualizado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {recent.map((product) => (
                    <tr key={product.id} className="hover:bg-surface-muted/60">
                      <td className="px-5 py-3">
                        <Link
                          to={`/admin/productos/${product.id}`}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={resolveImage(product.image)}
                            alt=""
                            className="h-11 w-9 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold leading-tight hover:text-primary">
                              {product.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted">{product.category}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <TypeBadge type={product.type} />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-5 py-3 text-xs text-muted">
                        {formatDate(product.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="rounded-xl border border-primary/15 bg-primary-soft p-5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="font-display text-lg font-semibold text-primary">
                Cómo funciona
              </h2>
            </div>
            <ol className="mt-4 space-y-3">
              {[
                'Creas el producto y lo guardas como borrador.',
                'Revisas precio, tallas, stock e imagen.',
                'Lo publicas y aparece en la tienda para las clientas.',
              ].map((step, index) => (
                <li key={step} className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[9px] font-semibold text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <h2 className="font-display text-lg font-semibold">Accesos rápidos</h2>
            <div className="mt-3 grid gap-2">
              <Link
                to="/admin/productos"
                className="flex items-center justify-between rounded-md border border-border-subtle px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <Boxes className="h-4 w-4" aria-hidden="true" />
                  Gestionar productos
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                to="/admin/ajustes"
                className="flex items-center justify-between rounded-md border border-border-subtle px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  Ajustes de la tienda
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                to="/"
                className="flex items-center justify-between rounded-md border border-border-subtle px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Ver tienda pública
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              <div>
                <h2 className="font-display text-base font-semibold">Datos de la demo</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {stats.units} unidades en inventario simulado. Reinicia la demo para
                  volver a los productos de ejemplo.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full justify-start text-warning hover:bg-warning-bg"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reiniciar demo
            </Button>
          </section>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-3">
        <Badge variant="outline">Catálogo</Badge>
        <p className="text-xs text-muted">
          {stats.retail} productos al detal, {stats.wholesale} packs al mayor y{' '}
          {stats.drafts} borradores que no ve la clienta.
        </p>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="¿Reiniciar la demo?"
        description="Se eliminarán los cambios locales y volverán los productos y ajustes de ejemplo. Las imágenes subidas a este navegador también se perderán."
        confirmLabel="Sí, reiniciar"
        destructive
        onConfirm={handleReset}
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string
  value: number
  hint: string
  icon: typeof Package
  tone?: 'neutral' | 'success' | 'warning' | 'error'
}) {
  const toneClasses = {
    neutral: 'bg-primary-soft text-primary',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
    error: 'bg-error-bg text-error',
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${toneClasses[tone]}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">{hint}</p>
    </div>
  )
}
