import { cn } from '../../lib/cn'

export function SizeSelector({
  sizes,
  value,
  onChange,
  label = 'Talla',
}: {
  sizes: string[]
  value: string | null
  onChange: (size: string) => void
  label?: string
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onChange(size)}
          aria-pressed={value === size}
          className={cn(
            'flex h-11 min-w-11 items-center justify-center rounded-md border px-3 font-mono text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            value === size
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-surface text-foreground hover:border-primary hover:text-primary',
          )}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
