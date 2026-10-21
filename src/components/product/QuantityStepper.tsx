import { Minus, Plus } from 'lucide-react'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = 'Cantidad',
  disabled = false,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  disabled?: boolean
}) {
  return (
    <div
      className="inline-flex h-11 items-center rounded-md border border-border bg-surface"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-primary disabled:opacity-35"
        aria-label="Disminuir cantidad"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="w-8 text-center font-mono text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-primary disabled:opacity-35"
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
