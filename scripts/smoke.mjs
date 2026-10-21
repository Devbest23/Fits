import { chromium, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const base = (process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/+$/, '')
const screenshots = 'screenshots'

await mkdir(screenshots, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
const errors = []
const failed = []

page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})
page.on('pageerror', (error) => errors.push(`PAGEERROR: ${error.message}`))
page.on('requestfailed', (request) => failed.push(`${request.url()} :: ${request.failure()?.errorText}`))

await page.goto(`${base}/`)
await expect(page.getByRole('heading', { level: 1 })).toContainText('Ropa que se mueve contigo')
await page.screenshot({ path: `${screenshots}/home-desktop.png`, fullPage: true })
console.log('✓ Home desktop')

await page.goto(`${base}/tienda`)
await expect(page.getByRole('heading', { level: 1 })).toContainText('Esenciales para entrenar')
await page.screenshot({ path: `${screenshots}/shop-desktop.png`, fullPage: true })
console.log('✓ Shop')

await page.goto(`${base}/producto/top-strappy-aire`)
await expect(page.getByRole('heading', { level: 1 })).toContainText('Top Strappy Aire')
await page.getByRole('button', { name: 'M', exact: true }).first().click()
await page.getByRole('button', { name: 'Añadir al carrito' }).click()
await expect(page.getByRole('dialog')).toContainText('Tu carrito')
await page.screenshot({ path: `${screenshots}/cart-drawer.png` })
await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
await page.goto(`${base}/carrito`)
await expect(page.getByRole('heading', { level: 1 })).toContainText('Carrito')
await expect(page.getByText('Top Strappy Aire').first()).toBeVisible()
const whatsappHref = await page.locator('a[href*="wa.me/1234567890"]').first().getAttribute('href')
if (!whatsappHref?.includes('Top%20Strappy%20Aire')) {
  throw new Error('El checkout de WhatsApp no incluye el resumen del producto')
}
console.log('✓ Product + cart + WhatsApp summary')

await page.goto(`${base}/mayor`)
await expect(page.getByRole('heading', { level: 1 })).toContainText('Surtí tu tienda con FITS')
await page.screenshot({ path: `${screenshots}/wholesale-desktop.png`, fullPage: true })
console.log('✓ Wholesale')

await page.goto(`${base}/admin/login`)
await page.getByRole('button', { name: 'Rellenar clave' }).click()
await page.getByRole('button', { name: 'Entrar al panel' }).click()
await expect(page).toHaveURL(`${base}/admin`)
await expect(page.getByRole('heading', { level: 1 })).toContainText('Resumen de tu tienda')
await page.screenshot({ path: `${screenshots}/admin-dashboard.png`, fullPage: true })
console.log('✓ Admin login + dashboard')

await page.goto(`${base}/admin/productos/nuevo`)
await page.locator('#field-name').fill('Producto de prueba')
await page.locator('#field-category').fill('Tops')
await page.locator('#field-price').fill('29.50')
await page.locator('#field-stock').fill('8')
await page.locator('#field-description').fill('Producto creado durante la prueba del panel de la dueña para validar la publicación.')
await page.locator('#product-image').setInputFiles('public/img/offer-pack.jpg')
await expect(page.locator('img[alt="Vista previa del producto"]')).toBeVisible()
await page.screenshot({ path: `${screenshots}/admin-product-editor.png`, fullPage: true })
await page.getByRole('button', { name: 'Publicar producto' }).click()
await expect(page).toHaveURL(`${base}/admin/productos`)
await expect(page.getByText('Producto de prueba').first()).toBeVisible()
console.log('✓ Admin create + publish')

await page.goto(`${base}/tienda?q=Producto%20de%20prueba`)
await expect(page.getByText('Producto de prueba').first()).toBeVisible()
await page.screenshot({ path: `${screenshots}/shop-new-product.png`, fullPage: true })
console.log('✓ New product visible on storefront')

await page.goto(`${base}/admin/productos`)
await page.getByRole('button', { name: 'Despublicar Producto de prueba' }).click()
await page.goto(`${base}/tienda?q=Producto%20de%20prueba`)
await expect(page.getByText('No encontramos productos con esos filtros.')).toBeVisible()
console.log('✓ Unpublished product hidden')

await page.goto(`${base}/admin/productos`)
await page.getByRole('button', { name: 'Despublicar Top Strappy Aire' }).click()
await page.goto(`${base}/producto/top-strappy-aire`)
await expect(page.getByText('Este producto no está disponible.')).toBeVisible()
await page.goto(`${base}/carrito`)
await expect(page.getByRole('heading', { name: 'Tu carrito está vacío.' })).toBeVisible()
console.log('✓ Draft product removed from cart')

const mobile = await context.newPage()
await mobile.setViewportSize({ width: 390, height: 844 })
await mobile.goto(`${base}/`)
await mobile.screenshot({ path: `${screenshots}/home-mobile.png`, fullPage: true })
await mobile.getByRole('button', { name: 'Abrir menú' }).click()
await expect(mobile.getByRole('dialog')).toContainText('Menú')
await mobile.screenshot({ path: `${screenshots}/mobile-menu.png` })
console.log('✓ Mobile menu')

console.log('CONSOLE ERRORS:', errors.length ? errors : 'none')
console.log('FAILED REQUESTS:', failed.length ? failed : 'none')

await browser.close()

if (errors.length || failed.length) process.exitCode = 1
