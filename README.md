# FITS · Storefront + panel de la dueña

Prototipo principal de la nueva tienda de FITS: storefront al detal, catálogo al mayor y panel privado para que la dueña cargue y publique productos. Esta versión reemplaza la web anterior y ahora vive en la raíz del repositorio (ya no hay carpeta `demo/`).

> Es una **demo funcional**: el catálogo, los ajustes y el carrito se guardan en el navegador. Todavía no usa una base de datos real. El siguiente paso, después del visto bueno, es conectar la API.

## Cómo verla

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

### Acceso al panel

- Ruta: `/admin/login`
- Clave de demostración: `fits2026`

También puedes entrar desde el enlace **“Probar el panel de la dueña”** del aviso superior o desde el pie de página.

## Flujo para revisar

1. Entra a **Tienda** y confirma que se ven los productos publicados.
2. Entra al **panel de la dueña** con la clave demo.
3. Crea un producto:
   - Nombre, categoría, descripción.
   - Tipo: **Al detal** o **Al mayor**.
   - Precio, stock y, si es al mayor, unidades por paquete.
   - Tallas disponibles.
   - Imagen: sube una desde tu equipo o elige una de referencia.
4. Guarda como **borrador** y comprueba que no aparece en la tienda.
5. Edita el producto y pulsa **Publicar producto**.
6. Abre la tienda y verifica que ahora sí aparece y se puede añadir al carrito.
7. Despublica el producto desde **Productos** y confirma que desaparece de la tienda y del carrito.
8. Prueba el checkout por WhatsApp: abre WhatsApp con el resumen del pedido.
9. En **Ajustes**, cambia el número de WhatsApp de demo y revisa el nuevo enlace.
10. Usa **Reiniciar demo** para volver a los datos de ejemplo.

## Qué es real en esta demo

- Rutas y navegación completas del storefront.
- Catálogo separado al detal y al mayor.
- Solo se muestran los productos con estado **Publicado**.
- Búsqueda, filtros por categoría, talla y ofertas.
- Carrito persistente en `localStorage`.
- Checkout por WhatsApp con resumen de productos, tallas, packs y total.
- Panel de administración con:
  - Login de demostración.
  - Resumen de productos publicados, borradores y stock bajo.
  - Crear, editar, publicar, despublicar y eliminar productos.
  - Carga de imágenes con compresión en el navegador.
  - Exportación del catálogo a JSON.
  - Ajustes de WhatsApp, correo y aviso superior.
- Diseño responsive y componentes accesibles (Radix + Tailwind).
- Build estático listo para GitHub Pages.

## Qué es simulado o queda pendiente

- **Autenticación real**: la clave está en el código y la sesión vive en el navegador. En producción debe validarse en una API con contraseña hasheada y cookie `HttpOnly`.
- **Persistencia**: el catálogo está en `localStorage`; cada navegador tiene su propia copia. Las clientas no verán los productos creados por la dueña en otro dispositivo hasta conectar el backend.
- **Subida de imágenes**: se guardan como data URL en el navegador para la demo. En producción deben subirse a la API o a un almacenamiento de objetos.
- **Publicación**: en la demo, publicar cambia el estado local. En producción, el catálogo publicado debe reconstruirse o servirse desde la API.
- **WhatsApp, correo, redes, dominio, país, moneda, envíos, devoluciones y razón social**: son placeholders. Están marcados para reemplazar antes de publicar.
- **Fotos**: son imágenes de referencia; algunas contienen marcas de terceros o marcas de agua. Hay que sustituirlas por fotos propias con derechos de uso.
- **Pagos y envíos**: no hay pasarela ni cálculo automático. Todo se coordina por WhatsApp en esta fase.
- **SEO de producción**: esta demo es una SPA. La versión final debe usar renderizado estático o SSR (por ejemplo Next.js) para que cada producto tenga metadatos, sitemap y HTML indexable.

## Datos que faltan del negocio

Antes de publicar la tienda real hay que completar:

- WhatsApp y correo reales.
- Dominio y redes sociales.
- País, moneda y métodos de pago.
- Políticas de envío, cambios y devoluciones.
- Fotos propias y autorización de uso.
- Razón social y datos legales.
- Catálogo real y precios por detal/mayor.

## Build y despliegue

```bash
npm run build
npm run preview
```

El build genera `dist/`, copia `index.html` a `404.html`, crea `.nojekyll` y genera carpetas con `index.html` para las rutas conocidas (tienda, mayor, carrito, ayuda, productos de ejemplo y panel). Así los enlaces directos funcionan en GitHub Pages; las rutas dinámicas nuevas siguen usando `404.html` como fallback.

### GitHub Pages con Actions (recomendado)

El repositorio incluye `.github/workflows/deploy-pages.yml`. Para activarlo:

1. En GitHub, abre **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.
3. Haz push a `main` o ejecuta el workflow manualmente desde **Actions**.
4. La URL del proyecto será `https://usuario.github.io/Fits/` (o la que indique GitHub Pages).

El workflow calcula automáticamente la base de Vite según el nombre del repositorio. Para un dominio propio, cambia `VITE_BASE_PATH` a `/` en el workflow o en el build manual.

### Build manual

Para publicar en la URL de proyecto de GitHub Pages (`https://usuario.github.io/Fits/`):

```bash
# PowerShell
$env:VITE_BASE_PATH="/Fits/"; npm run build
```

```bash
# Bash
VITE_BASE_PATH=/Fits/ npm run build
```

Para un dominio propio o la raíz de un usuario/organización:

```bash
VITE_BASE_PATH=/ npm run build
```

Luego sube el contenido de `dist/` a la rama o artefacto de GitHub Pages que corresponda. La web anterior se reemplazó por este proyecto; si necesitas consultarla, sigue disponible en el historial de Git.

## QA rápido

Con el servidor de desarrollo corriendo en el puerto 4173:

```bash
npm run dev -- --host 127.0.0.1 --port 4173
# en otra terminal
npm run test:smoke
```

El script revisa home, tienda, producto, carrito, mayor, login, creación/publicación de un producto, ocultamiento de un producto despublicado y menú móvil. Genera capturas en `screenshots/`.

También puedes ejecutar el escaneo de accesibilidad (WCAG 2.1 A/AA) con:

```bash
npm run test:a11y
```

Con el servidor corriendo en el puerto 4173, el escaneo revisa storefront, panel y versión móvil.

## Siguiente fase (después del visto bueno)

1. Convertir la demo en el monorepo definitivo (`apps/web`, `apps/admin`, `apps/api`, `packages/shared`).
2. API con Express + SQLite, autenticación real, sesiones y subida de imágenes.
3. Publicación del catálogo: admin guarda → se publica → storefront estático se reconstruye o consulta la API.
4. Migrar el storefront a Next.js con exportación estática para SEO.
5. Añadir tests de accesibilidad, rendimiento, formularios y flujo de compra.
6. Reemplazar placeholders y desplegar en el dominio real.
