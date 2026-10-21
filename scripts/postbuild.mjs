import { copyFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// WHY: GitHub Pages no conoce las rutas de una SPA. Copiar index.html a 404.html
// permite que React Router resuelva /tienda, /producto/:slug, /admin, etc.
const dist = join(process.cwd(), 'dist')
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
writeFileSync(join(dist, '.nojekyll'), '')

console.log('✔ 404.html y .nojekyll generados para GitHub Pages')
