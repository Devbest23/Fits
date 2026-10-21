import {
  Eye,
  EyeOff,
  Package,
  PackagePlus,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge, TypeBadge } from '../../components/admin/ProductBadges'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Input, Select } from '../../components/ui/Field'
import { useToast } from '../../components/ui/Toast'
import { formatPrice } from '../../lib/format'
import { resolveImage } from '../../lib/images'
import { usePageTitle } from '../../lib/usePageTitle'
import { useCatalog } from '../../store/catalog'
import type { Product, ProductStatus, ProductType } from '../../types'

type TypeFilter = 'all' | ProductType
type StatusFilter = 'all' | ProductStatus

export function AdminProducts() {
  usePageTitle('Productos')
  const products = useCatalog((state) => state.products)
  const toggleStatus = useCatalog((state) => state.toggleStatus)
  const deleteProduct = useCatalog((state) => state.deleteProduct)
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()
    return products.filter((product) => {
      if (typeFilter !== 'all' && product.type !== typeFilter) return false
      if (statusFilter !== 'all' && product.status !== statusFilter) return false
      if (
        query &&
        !product.name.toLowerCase().includes(query) &&
        !product.category.toLowerCase().includes(query)
      ) {
        return false
      }
      return true
    })
  }, [products, typeFilter, statusFilter, search])

  function handleToggle(product: Product) {
    toggleStatus(product.id)
    toast({
      variant: 'info',
      title:
        product.status === 'published' ? 'Producto despublicado' : 'Producto publicado',
      description:
        product.status === 'published'
          ? `${product.name} ya no aparece en la tienda.`
          : `${product.name} ya está visible para las clientas.`,
    })
  }

  function handleDelete() {
    if (!productToDelete) return
    deleteProduct(productToDelete.id)
    toast({
      variant: 'success',
      title: 'Producto eliminado',
      description: `${productToDelete.name} se quitó del catálogo.`,
    })
    setProductToDelete(null)
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            Catálogo
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Tus productos.
          </h1>
          <p className="mt-2 text-sm text-muted">
            {products.length} en total · {products.filter((p) => p.status === 'published').length}{' '}
            publicados
          </p>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <PackagePlus className="h-4 w-4" aria-hidden="true" />
          Nuevo producto
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar producto o categoría"
            aria-label="Buscar productos"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex">
          <Select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
            aria-label="Filtrar por tipo"
            className="md:w-40"
          >
            <option value="all">Todos los tipos</option>
            <option value="retail">Al detal</option>
            <option value="wholesale">Al mayor</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            aria-label="Filtrar por estado"
            className="md:w-40"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Package className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-display text-xl font-semibold">
            {products.length === 0 ? 'Tu catálogo está vacío.' : 'No hay productos con esos filtros.'}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {products.length === 0
              ? 'Crea tu primer producto. Se guardará como borrador hasta que decidas publicarlo.'
              : 'Prueba con otra búsqueda o cambia los filtros.'}
          </p>
          {products.length === 0 ? (
            <Link
              to="/admin/productos/nuevo"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white"
            >
              <PackagePlus className="h-4 w-4" aria-hidden="true" />
              Crear producto
            </Link>
          ) : (
            <Button
              variant="secondary"
              className="mt-5"
              onClick={() => {
                setSearch('')
                setTypeFilter('all')
                setStatusFilter('all')
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-xl border border-border-subtle bg-surface md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.1em]">
                    Producto
                  </th>
                  <th scope="col" className="px-3 py-3 font-mono text-[9px] uppercase tracking-[0.1em]">
                    Tipo
                  </th>
                  <th scope="col" className="px-3 py-3 font-mono text-[9px] uppercase tracking-[0.1em]">
                    Precio
                  </th>
                  <th scope="col" className="px-3 py-3 font-mono text-[9px] uppercase tracking-[0.1em]">
                    Stock
                  </th>
                  <th scope="col" className="px-3 py-3 font-mono text-[9px] uppercase tracking-[0.1em]">
                    Estado
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-mono text-[9px] uppercase tracking-[0.1em]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-muted/50">
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/admin/productos/${product.id}`}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={resolveImage(product.image)}
                          alt=""
                          className="h-12 w-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold leading-tight hover:text-primary">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted">
                            {product.category}
                            {product.type === 'wholesale' && product.packQuantity
                              ? ` · ${product.packQuantity} uds`
                              : ''}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3.5">
                      <TypeBadge type={product.type} />
                    </td>
                    <td className="px-3 py-3.5 font-mono text-xs">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={
                          product.stock <= 5
                            ? 'font-mono text-xs font-semibold text-warning'
                            : 'font-mono text-xs'
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/productos/${product.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-primary"
                          aria-label={`Editar ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggle(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-primary"
                          aria-label={
                            product.status === 'published'
                              ? `Despublicar ${product.name}`
                              : `Publicar ${product.name}`
                          }
                        >
                          {product.status === 'published' ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-error-bg hover:text-error"
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-3 md:hidden">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="rounded-xl border border-border-subtle bg-surface p-3"
              >
                <div className="flex gap-3">
                  <Link to={`/admin/productos/${product.id}`} className="shrink-0">
                    <img
                      src={resolveImage(product.image)}
                      alt=""
                      className="h-24 w-20 rounded-md object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/admin/productos/${product.id}`}
                        className="font-semibold leading-snug hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <StatusBadge status={product.status} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">{product.category}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <TypeBadge type={product.type} />
                      <span className="font-mono text-xs">{formatPrice(product.price)}</span>
                      <span className="text-[11px] text-muted">Stock: {product.stock}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <Link
                        to={`/admin/productos/${product.id}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggle(product)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
                      >
                        {product.status === 'published' ? (
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {product.status === 'published' ? 'Ocultar' : 'Publicar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-error-bg hover:text-error"
                        aria-label={`Eliminar ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 rounded-lg border border-border-subtle bg-surface px-4 py-3">
        <p className="text-xs leading-relaxed text-muted">
          <span className="font-semibold text-foreground">Importante:</span> los productos en
          borrador no aparecen en la tienda, en el buscador ni en el carrito. Al
          despublicar un producto, se elimina automáticamente de los carritos de las
          clientas.
        </p>
      </div>

      <ConfirmDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="¿Eliminar producto?"
        description={`Se eliminará “${productToDelete?.name ?? ''}” del catálogo. Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}
