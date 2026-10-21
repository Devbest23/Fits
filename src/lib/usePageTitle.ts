import { useEffect } from 'react'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | FITS` : 'FITS — Ropa que se mueve contigo'
  }, [title])
}
