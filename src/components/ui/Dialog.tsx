import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

type Side = 'center' | 'right' | 'left' | 'full'

export function DialogContent({
  title,
  description,
  side = 'center',
  className,
  children,
  showClose = true,
}: {
  title: string
  description?: string
  side?: Side
  className?: string
  children: ReactNode
  showClose?: boolean
}) {
  const sideClasses: Record<Side, string> = {
    center:
      'left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl',
    right:
      'right-0 top-0 h-dvh w-full max-w-md border-l border-border rounded-none',
    left:
      'left-0 top-0 h-dvh w-full max-w-sm border-r border-border rounded-none',
    full: 'inset-0 h-dvh w-full rounded-none',
  }

  const animationClass =
    side === 'right'
      ? 'dialog-content-right'
      : side === 'left'
        ? 'dialog-content-left'
        : 'dialog-content'

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-[#1a1b20]/55 backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        className={cn(
          'dialog-content-base fixed z-50 flex flex-col bg-surface text-foreground shadow-2xl outline-none',
          sideClasses[side],
          animationClass,
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-5 py-4">
          <div>
            <DialogPrimitive.Title className="font-display text-lg font-semibold tracking-tight">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description
              className={description ? 'mt-1 text-sm text-muted' : 'sr-only'}
            >
              {description ?? 'Contenido del diálogo'}
            </DialogPrimitive.Description>
          </div>
          {showClose ? (
            <DialogPrimitive.Close
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
