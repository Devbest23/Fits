export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-20">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
          aria-hidden="true"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Cargando…
        </p>
      </div>
    </div>
  )
}
