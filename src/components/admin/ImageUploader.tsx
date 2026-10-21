import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { IMAGE_OPTIONS } from '../../data/seed'
import { cn } from '../../lib/cn'
import { resolveImage } from '../../lib/images'

async function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No se pudo procesar la imagen.'))
    image.src = src
  })
}

async function compressImage(file: File) {
  const dataUrl = await readFile(file)
  const image = await loadImage(dataUrl)
  const scale = Math.min(1200 / image.width, 1500 / image.height, 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))
  const context = canvas.getContext('2d')
  if (!context) return dataUrl
  context.fillStyle = '#FAF8FF'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.82)
}

export function ImageUploader({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleFile(file: File | undefined) {
    if (!file) return
    setUploadError('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Usa una imagen JPG, PNG o WebP.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('La imagen no puede superar 10 MB.')
      return
    }

    try {
      setProcessing(true)
      const compressed = await compressImage(file)
      onChange(compressed)
    } catch {
      setUploadError('No pudimos procesar la imagen. Intenta con otra.')
    } finally {
      setProcessing(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <div
          className={cn(
            'relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg border border-dashed bg-surface-muted',
            error ? 'border-error' : 'border-border',
          )}
        >
          {value ? (
            <>
              <img
                src={resolveImage(value)}
                alt="Vista previa del producto"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-error shadow-sm hover:bg-error-bg"
                aria-label="Quitar imagen"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center px-4 text-center">
              <ImagePlus className="h-7 w-7 text-muted" aria-hidden="true" />
              <p className="mt-2 text-xs text-muted">Sin imagen</p>
            </div>
          )}
        </div>

        <div>
          <input
            ref={inputRef}
            id="product-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <label
            htmlFor="product-image"
            className={cn(
              'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-primary bg-transparent px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
              processing && 'pointer-events-none opacity-60',
            )}
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="h-4 w-4" aria-hidden="true" />
            )}
            {processing ? 'Procesando…' : 'Subir desde mi equipo'}
          </label>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            La imagen se optimiza a un máximo de 1200 px y se guarda en este navegador
            para la demo. En producción se subirá a la API.
          </p>
          {uploadError ? (
            <p className="mt-2 text-xs font-medium text-error" role="alert">
              {uploadError}
            </p>
          ) : null}
          {error ? (
            <p className="mt-2 text-xs font-medium text-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 border-t border-border-subtle pt-4">
        <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          O elige una imagen de referencia
        </p>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {IMAGE_OPTIONS.map((option) => (
            <button
              key={option.path}
              type="button"
              onClick={() => onChange(option.path)}
              className={cn(
                'group overflow-hidden rounded-md border-2 bg-surface-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                value === option.path
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-transparent hover:border-border',
              )}
              aria-label={`Usar imagen ${option.label}`}
              aria-pressed={value === option.path}
              title={option.label}
            >
              <img
                src={resolveImage(option.path)}
                alt=""
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
