import {
  ArrowLeft,
  Check,
  Eye,
  Package,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ImageUploader } from '../../components/admin/ImageUploader'
import { StatusBadge, TypeBadge } from '../../components/admin/ProductBadges'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { ErrorText, Hint, Input, Label, Select, Textarea } from '../../components/ui/Field'
import { useToast } from '../../components/ui/Toast'
import { CATEGORIES, SIZE_OPTIONS } from '../../data/seed'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { resolveImage } from '../../lib/images'
import { usePageTitle } from '../../lib/usePageTitle'
import { productFormSchema } from '../../lib/validation'
import { useCatalog } from '../../store/catalog'
import type { ProductStatus, ProductType } from '../../types'

interface FormState {
  name: string
  category: string
  type: ProductType
  price: string
  compareAtPrice: string
  description: string
  image: string
  sizes: string[]
  stock: string
  packQuantity: string
  featured: boolean
  status: ProductStatus
}

const emptyForm: FormState = {
  name: '',
  category: 'Tops',
  type: 'retail',
  price: '',
  compareAtPrice: '',
  description: '',
  image: '',
  sizes: ['S', 'M', 'L'],
  stock: '10',
  packQuantity: '6',
  featured: false,
  status: 'draft',
}

export function ProductEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const products = useCatalog((state) => state.products)
  const addProduct = useCatalog((state) => state.addProduct)
  const updateProduct = useCatalog((state) => state.updateProduct)
  const deleteProduct = useCatalog((state) => state.deleteProduct)
  const { toast } = useToast()

  const product = useMemo(
    () => (id ? products.find((candidate) => candidate.id === id) : undefined),
    [id, products],
  )
  const editing = Boolean(id)

  usePageTitle(editing ? 'Editar producto' : 'Nuevo producto')

  const [form, setForm] = useState<FormState>(() =>
    product
      ? {
          name: product.name,
          category: product.category,
          type: product.type,
          price: String(product.price),
          compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
          description: product.description,
          image: product.image,
          sizes: product.sizes,
          stock: String(product.stock),
          packQuantity: product.packQuantity ? String(product.packQuantity) : '6',
          featured: product.featured,
          status: product.status,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (editing && !product) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface px-6 py-16 text-center">
        <Package className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl font-semibold">Producto no encontrado.</h1>
        <p className="mt-2 text-sm text-muted">
          Puede que se haya eliminado o que el enlace esté incompleto.
        </p>
        <Link
          to="/admin/productos"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a productos
        </Link>
      </div>
    )
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[String(key)]) return current
      const next = { ...current }
      delete next[String(key)]
      return next
    })
  }

  function toggleSize(size: string) {
    update(
      'sizes',
      form.sizes.includes(size)
        ? form.sizes.filter((item) => item !== size)
        : [...form.sizes, size],
    )
  }

  function persist(statusOverride?: ProductStatus) {
    const candidate: FormState = {
      ...form,
      status: statusOverride ?? form.status,
      packQuantity: form.type === 'wholesale' ? form.packQuantity : '',
    }
    const result = productFormSchema.safeParse(candidate)

    if (!result.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? 'form')
        if (!nextErrors[key]) nextErrors[key] = issue.message
      }
      setErrors(nextErrors)
      const firstKey = Object.keys(nextErrors)[0]
      if (firstKey) {
        const element = document.getElementById(`field-${firstKey}`)
        element?.focus()
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      toast({
        variant: 'error',
        title: 'Revisa el producto',
        description: 'Hay campos obligatorios o valores que debes corregir.',
      })
      return
    }

    const data = result.data
    const input = {
      name: data.name,
      category: data.category,
      type: data.type,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      description: data.description,
      image: data.image,
      sizes: data.sizes,
      stock: data.stock,
      packQuantity: data.type === 'wholesale' ? (data.packQuantity ?? null) : null,
      featured: data.featured,
      status: data.status,
    }

    if (editing && product) {
      updateProduct(product.id, input)
      toast({
        variant: 'success',
        title:
          data.status === 'published' ? 'Producto actualizado' : 'Borrador actualizado',
        description:
          data.status === 'published'
            ? `${data.name} ya muestra los cambios en la tienda.`
            : `${data.name} quedó guardado sin publicar.`,
      })
    } else {
      addProduct(input)
      toast({
        variant: 'success',
        title:
          data.status === 'published' ? 'Producto publicado' : 'Borrador creado',
        description:
          data.status === 'published'
            ? `${data.name} ya está visible para las clientas.`
            : `${data.name} quedó guardado. Publícalo cuando esté listo.`,
      })
    }

    navigate('/admin/productos')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    persist()
  }

  function handleDelete() {
    if (!product) return
    deleteProduct(product.id)
    toast({
      variant: 'success',
      title: 'Producto eliminado',
      description: `${product.name} se quitó del catálogo.`,
    })
    navigate('/admin/productos')
  }

  const previewPrice = Number(form.price)
  const checklist = [
    { label: 'Nombre y descripción', done: form.name.trim().length >= 3 && form.description.trim().length >= 12 },
    { label: 'Imagen del producto', done: Boolean(form.image) },
    { label: 'Precio válido', done: Number.isFinite(previewPrice) && previewPrice > 0 },
    { label: 'Stock definido', done: form.stock !== '' && Number(form.stock) >= 0 },
    { label: 'Tallas seleccionadas', done: form.sizes.length > 0 },
  ]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            to="/admin/productos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Volver a productos
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            {editing ? 'Editar producto' : 'Cargar producto'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Completa la información, elige si es al detal o al mayor y decide si se publica.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/productos"
            className="inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-muted hover:bg-surface-strong hover:text-foreground"
          >
            Cancelar
          </Link>
          <Button type="submit" variant="secondary">
            <Save className="h-4 w-4" aria-hidden="true" />
            Guardar cambios
          </Button>
        </div>
      </div>

      {Object.keys(errors).length > 0 ? (
        <div
          className="mt-5 rounded-lg border border-error/20 bg-error-bg px-4 py-3"
          role="alert"
        >
          <p className="text-sm font-semibold text-error">Revisa los campos marcados.</p>
          <p className="mt-0.5 text-xs text-error/80">
            Corrige la información y vuelve a guardar. No se perdió nada de lo que
            escribiste.
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft font-mono text-[10px] font-semibold text-primary">
                01
              </span>
              <h2 className="font-display text-lg font-semibold">Información básica</h2>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <Label htmlFor="field-name">Nombre del producto</Label>
                <Input
                  id="field-name"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="Ej. Top Strappy Aire"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  autoFocus={!editing}
                />
                {errors.name ? <ErrorText id="error-name">{errors.name}</ErrorText> : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="field-category">Categoría</Label>
                  <Input
                    id="field-category"
                    list="category-options"
                    value={form.category}
                    onChange={(event) => update('category', event.target.value)}
                    placeholder="Tops, Leggings, Conjuntos…"
                    aria-invalid={Boolean(errors.category)}
                  />
                  <datalist id="category-options">
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                  {errors.category ? <ErrorText>{errors.category}</ErrorText> : null}
                </div>

                <div>
                  <Label htmlFor="field-status">Estado</Label>
                  <Select
                    id="field-status"
                    value={form.status}
                    onChange={(event) => update('status', event.target.value as ProductStatus)}
                  >
                    <option value="draft">Borrador (no visible)</option>
                    <option value="published">Publicado (visible)</option>
                  </Select>
                  <Hint>Los borradores solo se ven en este panel.</Hint>
                </div>
              </div>

              <fieldset>
                <legend className="mb-2 block text-[13px] font-semibold text-foreground">
                  Tipo de venta
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      value: 'retail' as const,
                      title: 'Al detal',
                      text: 'La clienta compra una unidad.',
                    },
                    {
                      value: 'wholesale' as const,
                      title: 'Al mayor',
                      text: 'Se vende por paquete o pack.',
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors',
                        form.type === option.value
                          ? 'border-primary bg-primary-soft/60'
                          : 'border-border bg-surface hover:border-primary/50',
                      )}
                    >
                      <input
                        type="radio"
                        name="product-type"
                        value={option.value}
                        checked={form.type === option.value}
                        onChange={() => {
                          update('type', option.value)
                          if (option.value === 'wholesale' && !form.packQuantity) {
                            update('packQuantity', '6')
                          }
                        }}
                        className="mt-1 h-4 w-4 accent-[#183678]"
                      />
                      <span>
                        <span className="block text-sm font-semibold">{option.title}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                          {option.text}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <Label htmlFor="field-description">Descripción</Label>
                <Textarea
                  id="field-description"
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  placeholder="Describe el tejido, el corte, el uso y lo que la clienta debe saber."
                  rows={5}
                  aria-invalid={Boolean(errors.description)}
                />
                <div className="flex items-start justify-between gap-3">
                  {errors.description ? (
                    <ErrorText>{errors.description}</ErrorText>
                  ) : (
                    <Hint>Mínimo 12 caracteres. Evita promesas que no puedas cumplir.</Hint>
                  )}
                  <span className="mt-1.5 shrink-0 font-mono text-[9px] text-muted">
                    {form.description.length}/600
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft font-mono text-[10px] font-semibold text-primary">
                02
              </span>
              <h2 className="font-display text-lg font-semibold">Precio e inventario</h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="field-price">Precio de venta (USD)</Label>
                <Input
                  id="field-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => update('price', event.target.value)}
                  placeholder="0.00"
                  aria-invalid={Boolean(errors.price)}
                />
                {errors.price ? <ErrorText>{errors.price}</ErrorText> : null}
              </div>

              <div>
                <Label htmlFor="field-compareAtPrice">Precio anterior (opcional)</Label>
                <Input
                  id="field-compareAtPrice"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={form.compareAtPrice}
                  onChange={(event) => update('compareAtPrice', event.target.value)}
                  placeholder="Para mostrar oferta"
                  aria-invalid={Boolean(errors.compareAtPrice)}
                />
                {errors.compareAtPrice ? (
                  <ErrorText>{errors.compareAtPrice}</ErrorText>
                ) : (
                  <Hint>Si lo dejas vacío, no se muestra descuento.</Hint>
                )}
              </div>

              <div>
                <Label htmlFor="field-stock">
                  {form.type === 'wholesale' ? 'Packs disponibles' : 'Unidades disponibles'}
                </Label>
                <Input
                  id="field-stock"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => update('stock', event.target.value)}
                  aria-invalid={Boolean(errors.stock)}
                />
                {errors.stock ? (
                  <ErrorText>{errors.stock}</ErrorText>
                ) : (
                  <Hint>Con 0 se muestra como agotado.</Hint>
                )}
              </div>

              {form.type === 'wholesale' ? (
                <div>
                  <Label htmlFor="field-packQuantity">Unidades por paquete</Label>
                  <Input
                    id="field-packQuantity"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={form.packQuantity}
                    onChange={(event) => update('packQuantity', event.target.value)}
                    aria-invalid={Boolean(errors.packQuantity)}
                  />
                  {errors.packQuantity ? (
                    <ErrorText>{errors.packQuantity}</ErrorText>
                  ) : (
                    <Hint>Ej. 6 tops por pack.</Hint>
                  )}
                </div>
              ) : (
                <div className="flex items-end">
                  <div className="w-full rounded-md bg-surface-muted p-3">
                    <p className="text-xs text-muted">
                      Este producto se vende por unidad. Si quieres vender packs, cambia el
                      tipo a <strong>Al mayor</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-primary/50">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => update('featured', event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#183678]"
              />
              <span>
                <span className="block text-sm font-semibold">Destacar en la tienda</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                  Puede aparecer en la selección de favoritos de la página de inicio.
                </span>
              </span>
            </label>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft font-mono text-[10px] font-semibold text-primary">
                03
              </span>
              <h2 className="font-display text-lg font-semibold">
                {form.type === 'wholesale' ? 'Tallas incluidas en el pack' : 'Tallas disponibles'}
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              La clienta solo podrá elegir entre las tallas que marques aquí. Para un pack,
              indica las tallas que incluye el surtido.
            </p>
            <div
              id="field-sizes"
              role="group"
              aria-label="Tallas disponibles"
              tabIndex={-1}
              className="mt-4 flex flex-wrap gap-2"
            >
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  aria-pressed={form.sizes.includes(size)}
                  className={cn(
                    'flex h-11 min-w-11 items-center justify-center rounded-md border px-3 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    form.sizes.includes(size)
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-surface text-foreground hover:border-primary',
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes ? <ErrorText>{errors.sizes}</ErrorText> : null}
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft font-mono text-[10px] font-semibold text-primary">
                04
              </span>
              <h2 className="font-display text-lg font-semibold">Imagen del producto</h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Usa una foto vertical. Puedes subir una desde tu equipo o elegir una imagen de
              referencia para revisar el flujo.
            </p>
            <div className="mt-4">
              <ImageUploader
                value={form.image}
                onChange={(value) => update('image', value)}
                error={errors.image}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-xl border border-border-subtle bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold">Vista previa</h2>
              <div className="flex gap-1.5">
                <TypeBadge type={form.type} />
                <StatusBadge status={form.status} />
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-border-subtle bg-surface-strong">
              {form.image ? (
                <img
                  src={resolveImage(form.image)}
                  alt="Vista previa"
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] flex-col items-center justify-center text-muted">
                  <Package className="h-7 w-7" aria-hidden="true" />
                  <p className="mt-2 text-xs">Añade una imagen</p>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                {form.category || 'Categoría'}
              </p>
              <p className="mt-1 font-display text-lg font-semibold leading-snug">
                {form.name || 'Nombre del producto'}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-sm font-semibold">
                  {formatPrice(Number.isFinite(previewPrice) ? previewPrice : 0)}
                </span>
                {form.compareAtPrice ? (
                  <span className="font-mono text-[11px] text-muted line-through">
                    {formatPrice(Number(form.compareAtPrice) || 0)}
                  </span>
                ) : null}
              </div>
              {form.type === 'wholesale' ? (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                  <Package className="h-3 w-3" aria-hidden="true" />
                  Pack de {form.packQuantity || '—'} unidades
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-4">
            <h2 className="font-display text-base font-semibold">Antes de publicar</h2>
            <ul className="mt-3 space-y-2">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full',
                      item.done ? 'bg-success-bg text-success' : 'bg-surface-strong text-muted',
                    )}
                  >
                    {item.done ? (
                      <Check className="h-2.5 w-2.5" aria-hidden="true" />
                    ) : (
                      <X className="h-2.5 w-2.5" aria-hidden="true" />
                    )}
                  </span>
                  <span className={item.done ? 'text-muted-2' : 'text-muted'}>{item.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-md bg-primary-soft p-2.5">
              <p className="text-[10px] leading-relaxed text-muted-2">
                Si guardas como borrador, la clienta no lo verá hasta que lo publiques.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-4">
            <div className="grid gap-2">
              <Button type="button" onClick={() => persist('published')}>
                <Eye className="h-4 w-4" aria-hidden="true" />
                {form.status === 'published' ? 'Guardar y mantener publicado' : 'Publicar producto'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => persist('draft')}>
                <Save className="h-4 w-4" aria-hidden="true" />
                Guardar como borrador
              </Button>
              <Link
                to="/admin/productos"
                className="inline-flex h-10 items-center justify-center rounded-md text-xs font-semibold text-muted hover:bg-surface-strong hover:text-foreground"
              >
                Cancelar
              </Link>
            </div>

            {editing ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-3 w-full justify-start text-error hover:bg-error-bg"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Eliminar producto
              </Button>
            ) : null}
          </section>

          <div className="flex items-start gap-2 rounded-lg border border-border-subtle bg-surface p-3">
            <Badge variant="outline" className="shrink-0">
              Demo
            </Badge>
            <p className="text-[10px] leading-relaxed text-muted">
              Los cambios se guardan en este navegador. La versión final los enviará a la
              API para que todas las clientas vean el mismo catálogo.
            </p>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="¿Eliminar este producto?"
        description={`Se eliminará “${product?.name ?? form.name}” del catálogo. Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        destructive
        onConfirm={handleDelete}
      />
    </form>
  )
}
