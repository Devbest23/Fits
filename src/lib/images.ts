/**
 * WHY: en GitHub Pages la demo puede vivir en /Fits/. Las rutas absolutas
 * de las imágenes deben respetar `import.meta.env.BASE_URL`.
 * Las imágenes subidas por la dueña son data URLs y se devuelven tal cual.
 */
export function resolveImage(src: string) {
  if (!src) return `${import.meta.env.BASE_URL}img/fits-logo.png`
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('blob:')) {
    return src
  }
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  return `${base}${src.replace(/^\//, '')}`
}

export const LOGO_SRC = resolveImage('img/fits-logo.png')
