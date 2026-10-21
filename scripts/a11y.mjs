import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const base = (process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/+$/, '')
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()

async function scan(name, url) {
  await page.goto(`${base}${url}`)
  await page.waitForTimeout(400)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  const relevant = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact),
  )
  console.log(`\n${name}: ${results.violations.length} violations, ${relevant.length} serious/critical`)
  for (const violation of results.violations) {
    console.log(`- [${violation.impact}] ${violation.id}: ${violation.help}`)
    for (const node of violation.nodes.slice(0, 4)) {
      console.log(`    ${node.target.join(' ')}`)
    }
  }
}

await scan('Home', '/')
await scan('Tienda', '/tienda')
await scan('Producto', '/producto/top-strappy-aire')
await scan('Carrito', '/carrito')
await scan('Mayor', '/mayor')
await scan('Ayuda', '/ayuda')
await scan('Admin login', '/admin/login')

await page.goto(`${base}/admin/login`)
await page.getByRole('button', { name: 'Rellenar clave' }).click()
await page.getByRole('button', { name: 'Entrar al panel' }).click()
await page.waitForURL(`${base}/admin`)
await scan('Admin dashboard', '/admin')
await scan('Admin productos', '/admin/productos')
await scan('Admin nuevo producto', '/admin/productos/nuevo')
await scan('Admin ajustes', '/admin/ajustes')

const mobile = await context.newPage()
await mobile.setViewportSize({ width: 390, height: 844 })
await mobile.goto(base)
await mobile.waitForTimeout(300)
const mobileResults = await new AxeBuilder({ page: mobile })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  .analyze()
console.log(`\nHome mobile: ${mobileResults.violations.length} violations`)
for (const violation of mobileResults.violations) {
  console.log(`- [${violation.impact}] ${violation.id}: ${violation.help}`)
}

await browser.close()
