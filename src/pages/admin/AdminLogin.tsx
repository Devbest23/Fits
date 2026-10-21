import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input, Label } from '../../components/ui/Field'
import { usePageTitle } from '../../lib/usePageTitle'
import { DEMO_PASSWORD, useAuth } from '../../store/auth'

export function AdminLogin() {
  usePageTitle('Panel de la dueña')
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const login = useAuth((state) => state.login)
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!password.trim()) {
      setError('Escribe la clave de acceso.')
      return
    }
    if (!login(password)) {
      setError('La clave no es correcta. Revisa el dato de la demo.')
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-white lg:flex lg:p-14">
        <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" aria-hidden="true" />

        <Link
          to="/"
          className="relative inline-flex w-fit flex-col rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary"
        >
          <span className="font-display text-3xl font-semibold tracking-[-0.04em]">FITS</span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-primary-soft">
            Basic and sport
          </span>
        </Link>

        <div className="relative max-w-lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary-soft">
            Panel de administración
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] lg:text-5xl">
            Tú publicas. La tienda muestra.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-soft">
            Carga productos, define si son al detal o al mayor y decide cuándo se
            publican. Las clientas solo pueden comprar lo que tú publiques.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              'Productos en borrador antes de publicar',
              'Precios y stock bajo tu control',
              'Catálogo al detal y al mayor en un solo lugar',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/90">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[9px] uppercase tracking-[0.14em] text-primary-soft/70">
          Prototipo · Datos guardados en este navegador
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex flex-col">
              <span className="font-display text-2xl font-semibold tracking-[-0.04em]">FITS</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
                Basic and sport
              </span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Ver tienda
            </Link>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface p-6 shadow-[0_24px_60px_-40px_rgba(24,54,120,0.35)] sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em]">
              Entrar al panel
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Acceso exclusivo para la dueña de la tienda. Aquí se cargan y publican los
              productos.
            </p>

            <form className="mt-6" onSubmit={handleSubmit} noValidate>
              <Label htmlFor="admin-password">Clave de acceso</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError('')
                  }}
                  placeholder="Escribe tu clave"
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'password-error' : 'password-hint'}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-strong hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {error ? (
                <p id="password-error" className="mt-2 text-xs font-medium text-error" role="alert">
                  {error}
                </p>
              ) : (
                <p id="password-hint" className="mt-2 text-xs text-muted">
                  Demo: usa la clave temporal para revisar el flujo.
                </p>
              )}

              <Button type="submit" size="lg" className="mt-5 w-full">
                Entrar al panel
              </Button>
            </form>

            <div className="mt-5 rounded-md border border-primary/15 bg-primary-soft/70 p-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                  Acceso de demostración
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <code className="rounded bg-surface px-2 py-1 font-mono text-xs text-foreground">
                  {DEMO_PASSWORD}
                </code>
                <button
                  type="button"
                  onClick={() => setPassword(DEMO_PASSWORD)}
                  className="text-xs font-semibold text-primary underline underline-offset-2"
                >
                  Rellenar clave
                </button>
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
              Esta demo no es segura para producción. La versión final usará autenticación
              con contraseña hasheada y sesión en la API.
            </p>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-muted hover:text-primary lg:hidden"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Volver a la tienda
          </Link>
        </div>
      </section>
    </div>
  )
}
