import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// WHY: GitHub Pages no conoce las rutas de una SPA. Copiar index.html a 404.html
// permite que React Router resuelva rutas dinámicas desconocidas. Para las rutas
// conocidas generamos carpetas con index.html y así la navegación directa no
// devuelve un 404 (mejor para compartir enlaces y para el checker de QA).
const dist = join(process.cwd(), 'dist')
const index = join(dist, 'index.html')

// Mantener en sincronía con los slugs e IDs de src/data/seed.ts. Los productos
// creados desde el panel no se pueden pre-generar: usan el fallback 404.html.
const productSlugs = [
  'chaqueta-wrap-sport',
  'top-strappy-aire',
  'leggings-sculpt',
  'conjunto-essential-mocha',
  'pantalon-wide-leg',
  'short-flex-deportivo',
  'chaqueta-running-shell',
  'conjunto-canela-soft',
  'pack-6-tops-strappy',
  'pack-12-leggings-sculpt',
  'pack-8-conjuntos-essential',
]

const seedProductIds = [
  'seed-retail-1',
  'seed-retail-2',
  'seed-retail-3',
  'seed-retail-4',
  'seed-retail-5',
  'seed-retail-6',
  'seed-retail-7',
  'seed-retail-8',
  'seed-wholesale-1',
  'seed-wholesale-2',
  'seed-wholesale-3',
]

const routes = [
  'tienda',
  'mayor',
  'carrito',
  'ayuda',
  'admin',
  'admin/login',
  'admin/productos',
  'admin/productos/nuevo',
  'admin/ajustes',
  ...productSlugs.map((slug) => `producto/${slug}`),
  ...seedProductIds.map((id) => `admin/productos/${id}`),
]

copyFileSync(index, join(dist, '404.html'))
writeFileSync(join(dist, '.nojekyll'), '')

for (const route of routes) {
  const directory = join(dist, route)
  mkdirSync(directory, { recursive: true })
  copyFileSync(index, join(directory, 'index.html'))
}

console.log(`✔ 404.html, .nojekyll y ${routes.length} rutas estáticas generadas para GitHub Pages`)
