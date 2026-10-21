import {
  Download,
  MessageCircle,
  RotateCcw,
  Save,
  ShieldAlert,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Hint, Input, Label, Textarea } from '../../components/ui/Field'
import { useToast } from '../../components/ui/Toast'
import { whatsappUrl } from '../../lib/order'
import { usePageTitle } from '../../lib/usePageTitle'
import { useCatalog } from '../../store/catalog'
import { defaultSettings, useSite } from '../../store/site'
import type { SiteSettings } from '../../types'

export function AdminSettings() {
  usePageTitle('Ajustes')
  const site = useSite()
  const updateSettings = useSite((state) => state.updateSettings)
  const resetSettings = useSite((state) => state.resetSettings)
  const resetDemoCatalog = useCatalog((state) => state.resetDemo)
  const products = useCatalog((state) => state.products)
  const { toast } = useToast()

  const [form, setForm] = useState<SiteSettings>({
    whatsapp: site.whatsapp,
    whatsappDisplay: site.whatsappDisplay,
    email: site.email,
    shippingNote: site.shippingNote,
    announcement: site.announcement,
  })
  const [error, setError] = useState('')
  const [confirmSettings, setConfirmSettings] = useState(false)
  const [confirmCatalog, setConfirmCatalog] = useState(false)

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const digits = form.whatsapp.replace(/\D/g, '')
    if (digits.length < 7) {
      setError('Escribe un número de WhatsApp con código de país (solo dígitos).')
      return
    }
    if (!form.email.includes('@')) {
      setError('Escribe un correo válido.')
      return
    }

    updateSettings({ ...form, whatsapp: digits })
    toast({
      variant: 'success',
      title: 'Ajustes guardados',
      description: 'El checkout y los enlaces de contacto ya usan estos datos.',
    })
  }

  function handleResetSettings() {
    resetSettings()
    setForm(defaultSettings)
    toast({
      variant: 'info',
      title: 'Ajustes restablecidos',
      description: 'Volvieron los datos de ejemplo de la demo.',
    })
  }

  function handleResetCatalog() {
    resetDemoCatalog()
    toast({
      variant: 'info',
      title: 'Catálogo restablecido',
      description: 'Volvieron los productos de ejemplo. Tus cambios locales se borraron.',
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
      description: 'Guarda el JSON como respaldo o para migrarlo a la API.',
    })
  }

  const previewUrl =
    form.whatsapp.replace(/\D/g, '').length >= 7
      ? whatsappUrl(form.whatsapp, 'Hola FITS. Quiero consultar por un producto.')
      : null

  return (
    <div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
          Configuración
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          Ajustes de la tienda.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Estos datos alimentan los botones de WhatsApp, el correo de contacto y el aviso
          superior de la tienda. En producción se guardarán en la API.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="font-display text-lg font-semibold">Contacto y WhatsApp</h2>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <Label htmlFor="settings-whatsapp">Número de WhatsApp</Label>
                <Input
                  id="settings-whatsapp"
                  type="tel"
                  inputMode="tel"
                  value={form.whatsapp}
                  onChange={(event) => update('whatsapp', event.target.value)}
                  placeholder="Ej. 584141234567"
                />
                <Hint>
                  Incluye el código de país, sin espacios ni símbolos. Ejemplo genérico:
                  584141234567.
                </Hint>
              </div>

              <div>
                <Label htmlFor="settings-whatsapp-display">Número visible en la web</Label>
                <Input
                  id="settings-whatsapp-display"
                  value={form.whatsappDisplay}
                  onChange={(event) => update('whatsappDisplay', event.target.value)}
                  placeholder="+58 414 123 4567"
                />
                <Hint>Este texto se muestra en el pie de página y en la ayuda.</Hint>
              </div>

              <div>
                <Label htmlFor="settings-email">Correo de contacto</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="hola@tudominio.com"
                />
              </div>

              <div>
                <Label htmlFor="settings-announcement">Aviso superior</Label>
                <Input
                  id="settings-announcement"
                  value={form.announcement}
                  onChange={(event) => update('announcement', event.target.value)}
                  maxLength={90}
                />
                <Hint>Una frase corta. Se muestra en la franja navy de la tienda.</Hint>
              </div>

              <div>
                <Label htmlFor="settings-shipping">Nota de envío</Label>
                <Textarea
                  id="settings-shipping"
                  value={form.shippingNote}
                  onChange={(event) => update('shippingNote', event.target.value)}
                  rows={4}
                />
                <Hint>
                  Se usará en la página de ayuda y en el resumen del carrito. El costo final
                  se confirma por WhatsApp.
                </Hint>
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-md border border-error/20 bg-error-bg px-3 py-2 text-xs font-medium text-error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="submit">
                <Save className="h-4 w-4" aria-hidden="true" />
                Guardar ajustes
              </Button>
              {previewUrl ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Probar WhatsApp
                </a>
              ) : null}
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <h2 className="font-display text-lg font-semibold">Datos y respaldo</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              La demo guarda el catálogo en el almacenamiento local de este navegador. Puedes
              exportarlo como JSON para revisarlo o migrarlo después a la base de datos real.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={exportCatalog}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Exportar catálogo ({products.length})
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmCatalog(true)}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Restablecer catálogo
              </Button>
            </div>
          </section>

          <section className="rounded-xl border border-warning/20 bg-warning-bg/60 p-5">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              <div>
                <h2 className="font-display text-base font-semibold text-warning">
                  Seguridad de la demo
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-2">
                  La clave está escrita en el código de la demo y los datos viven en este
                  navegador. Eso sirve para mostrar el flujo, pero no para producción. La
                  siguiente fase incluye API, contraseña hasheada, sesión segura y
                  almacenamiento de imágenes en el servidor.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-5">
            <h2 className="font-display text-lg font-semibold">Datos pendientes del negocio</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Antes de publicar la tienda real hay que reemplazar los placeholders:
            </p>
            <ul className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-2">
              {[
                'WhatsApp y correo reales',
                'Dominio y redes sociales',
                'País, moneda y métodos de pago',
                'Políticas de envío y devoluciones',
                'Fotos propias con derechos de uso',
                'Razón social y datos legales',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-xl border border-primary/15 bg-primary-soft p-5">
            <h2 className="font-display text-lg font-semibold text-primary">Vista rápida</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                  WhatsApp
                </dt>
                <dd className="mt-0.5 font-semibold text-foreground">
                  {form.whatsappDisplay || 'Sin definir'}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                  Correo
                </dt>
                <dd className="mt-0.5 break-all font-semibold text-foreground">
                  {form.email || 'Sin definir'}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                  Aviso
                </dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-muted-2">
                  {form.announcement || 'Sin aviso'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border-subtle bg-surface p-4">
            <h2 className="font-display text-base font-semibold">Restablecer demo</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Vuelve a los ajustes de ejemplo. No borra el catálogo.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setConfirmSettings(true)}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Restablecer ajustes
            </Button>
          </section>

          <p className="px-1 text-[10px] leading-relaxed text-muted">
            Consejo: guarda los ajustes y luego abre la tienda para revisar el botón de
            WhatsApp con el número nuevo.
          </p>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmSettings}
        onOpenChange={setConfirmSettings}
        title="¿Restablecer ajustes?"
        description="El WhatsApp, correo, aviso y nota de envío volverán a los valores de ejemplo de la demo."
        confirmLabel="Sí, restablecer"
        onConfirm={handleResetSettings}
      />
      <ConfirmDialog
        open={confirmCatalog}
        onOpenChange={setConfirmCatalog}
        title="¿Restablecer catálogo?"
        description="Se eliminarán los productos creados o modificados en este navegador y volverán los productos de ejemplo. Esta acción no se puede deshacer."
        confirmLabel="Sí, restablecer"
        destructive
        onConfirm={handleResetCatalog}
      />
    </div>
  )
}
