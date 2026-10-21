import { Filter, PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductGrid } from '../components/product/ProductGrid'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Field'
import { CATEGORIES, SIZE_OPTIONS } from '../data/seed'
import { cn } from '../lib/cn'
import { usePageTitle } from '../lib/usePageTitle'
import { useCatalog } from '../store/catalog'

const sortOptions = [
  { value: 'destacados', label: 'Destacados' },
  { value: 'precio-asc', label: 'Menor precio' },
  { value: 'precio-desc', label: 'Mayor precio' },
  { value: 'nuevos', label: 'Más recientes' },
]

export function Shop() {
  usePageTitle('Tienda')
  const products = useCatalog((state) => state.products)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = searchParams.get('categoria') ?? 'Todos'
  const size = searchParams.get('talla') ?? ''
  const search = searchParams.get('q') ?? ''
  const offersOnly = searchParams.get('ofertas') === '1'
  const sort = searchParams.get('orden') ?? 'destacados'

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const publishedRetail = useMemo(
    () => products.filter((product) => product.status === 'published' && product.type === 'retail'),
    [products],
  )

  const filtered = useMemo(() => {
    let result = [...publishedRetail]

    if (category !== 'Todos') {
      result = result.filter((product) => product.category === category)
    }
    if (size) {
      result = result.filter((product) => product.sizes.includes(size))
    }
    if (offersOnly) {
      result = result.filter((product) => Boolean(product.compareAtPrice))
    }
    if (search.trim()) {
      const query = search.toLowerCase().trim()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      )
    }

    switch (sort) {
      case 'precio-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'precio-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'nuevos':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        break
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured))
    }

    return result
  }, [publishedRetail, category, size, offersOnly, search, sort])

  const activeFilters = [
    category !== 'Todos' ? { key: 'categoria', label: category } : null,
    size ? { key: 'talla', label: `Talla ${size}` } : null,
    offersOnly ? { key: 'ofertas', label: 'Solo ofertas' } : null,
    search ? { key: 'q', label: `“${search}”` } : null,
  ].filter(Boolean) as { key: string; label: string }[]

  function clearFilters() {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  return (
    <div className="section-pad">
      <div className="container-fits">
        <nav className="breadcrumb" aria-label="Migas de pan">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Tienda</span>
        </nav>

        <header className="mt-5 max-w-2xl">
          <p className="label-kicker">Catálogo al detal</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Esenciales para entrenar.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-2">
            Solo verás las piezas que la dueña publicó. Elige tu talla, añade al carrito y
            coordina el pedido por WhatsApp.
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-3 border-y border-border-subtle py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setParam('q', event.target.value || null)}
              placeholder="Buscar por nombre o categoría"
              className="pl-9"
              aria-label="Buscar productos"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              className="lg:hidden"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filtros
            </Button>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="hidden text-xs text-muted sm:block">
                Ordenar
              </label>
              <Select
                id="sort"
                value={sort}
                onChange={(event) => setParam('orden', event.target.value)}
                className="w-auto min-w-40"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-muted sm:inline">
              {filtered.length} resultados
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-10">
          <aside className={cn('lg:block', filtersOpen ? 'block' : 'hidden')}>
            <div className="rounded-lg border border-border-subtle bg-surface p-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Filtros</h2>
                <SlidersHorizontal className="h-4 w-4 text-muted" aria-hidden="true" />
              </div>

              <div className="mt-5 border-t border-border-subtle pt-4">
                <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                  Categoría
                </p>
                <div className="flex flex-col gap-1">
                  {['Todos', ...CATEGORIES.filter((item) => item !== 'Packs')].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setParam('categoria', item === 'Todos' ? null : item)}
                      className={cn(
                        'rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                        category === item
                          ? 'bg-primary-soft font-semibold text-primary'
                          : 'text-muted-2 hover:bg-surface-muted hover:text-foreground',
                      )}
                      aria-pressed={category === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-border-subtle pt-4">
                <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                  Talla
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SIZE_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setParam('talla', size === item ? null : item)}
                      aria-pressed={size === item}
                      className={cn(
                        'flex h-9 min-w-9 items-center justify-center rounded border px-2 font-mono text-[10px] transition-colors',
                        size === item
                          ? 'border-primary bg-primary text-white'
                          : 'border-border bg-surface text-muted-2 hover:border-primary',
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-border-subtle pt-4">
                <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-muted-2">
                  <span>Solo ofertas</span>
                  <input
                    type="checkbox"
                    checked={offersOnly}
                    onChange={(event) => setParam('ofertas', event.target.checked ? '1' : null)}
                    className="h-4 w-4 rounded border-border text-primary accent-[#183678]"
                  />
                </label>
              </div>

              {activeFilters.length > 0 ? (
                <Button variant="ghost" size="sm" className="mt-5 w-full" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              ) : null}
            </div>
          </aside>

          <section aria-labelledby="products-title">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 id="products-title" className="sr-only">
                Productos
              </h2>
              {activeFilters.length === 0 ? (
                <Badge variant="outline">{filtered.length} productos publicados</Badge>
              ) : (
                activeFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setParam(filter.key, null)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-primary"
                  >
                    {filter.label}
                    <X className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">Quitar filtro</span>
                  </button>
                ))
              )}
              {activeFilters.length > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-primary underline underline-offset-2"
                >
                  Limpiar todo
                </button>
              ) : null}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <PackageSearch className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  No encontramos productos con esos filtros.
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  Prueba con otra categoría o talla. También puedes ver todo el catálogo
                  publicado.
                </p>
                <Button className="mt-5" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <ProductGrid products={filtered} />
            )}

            <div className="mt-12 max-w-2xl border-t border-border-subtle pt-6">
              <h2 className="font-display text-xl font-semibold">Sobre la colección</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                FITS reúne tops, leggings, conjuntos y chaquetas pensados para el
                movimiento diario. Cada producto se publica desde el panel de la dueña:
                si no está publicado, no aparece en la tienda ni se puede comprar.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
