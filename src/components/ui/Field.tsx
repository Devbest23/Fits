import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      className={cn('mb-2 block text-[13px] font-semibold text-foreground', className)}
      {...props}
    />
  )
}

export function Hint({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('mt-1.5 text-xs leading-relaxed text-muted', className)} {...props} />
}

export function ErrorText({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('mt-1.5 text-xs font-medium leading-relaxed text-error', className)}
      role="alert"
      {...props}
    />
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground shadow-none outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-strong',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full resize-y rounded-md border border-border bg-surface px-3 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-strong',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-strong',
        className,
      )}
      {...props}
    />
  )
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : hint ? <Hint>{hint}</Hint> : null}
    </div>
  )
}
