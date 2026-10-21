import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastMessage {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: Omit<ToastMessage, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const toast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setMessages((current) => [...current, { ...message, id }])
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    const timers = messages.map((message) =>
      window.setTimeout(() => {
        setMessages((current) => current.filter((item) => item.id !== message.id))
      }, 4200),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [messages])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[380px]"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.map((message) => {
          const Icon = icons[message.variant]
          return (
            <div
              key={message.id}
              className={cn(
                'pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-surface p-4 shadow-lg',
                message.variant === 'success' && 'border-success/20',
                message.variant === 'error' && 'border-error/20',
                message.variant === 'info' && 'border-primary/20',
              )}
            >
              <Icon
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0',
                  message.variant === 'success' && 'text-success',
                  message.variant === 'error' && 'text-error',
                  message.variant === 'info' && 'text-primary',
                )}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{message.title}</p>
                {message.description ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {message.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() =>
                  setMessages((current) =>
                    current.filter((item) => item.id !== message.id),
                  )
                }
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-strong hover:text-foreground"
                aria-label="Cerrar notificación"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider')
  return context
}
