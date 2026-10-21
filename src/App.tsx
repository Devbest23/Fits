import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/admin/AdminLayout'
import { PageLoader } from './components/layout/PageLoader'
import { PublicLayout } from './components/layout/PublicLayout'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { ToastProvider } from './components/ui/Toast'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

const Shop = lazy(() => import('./pages/Shop').then((module) => ({ default: module.Shop })))
const Wholesale = lazy(() =>
  import('./pages/Wholesale').then((module) => ({ default: module.Wholesale })),
)
const ProductPage = lazy(() =>
  import('./pages/Product').then((module) => ({ default: module.ProductPage })),
)
const CartPage = lazy(() =>
  import('./pages/Cart').then((module) => ({ default: module.CartPage })),
)
const Help = lazy(() => import('./pages/Help').then((module) => ({ default: module.Help })))

const AdminLogin = lazy(() =>
  import('./pages/admin/AdminLogin').then((module) => ({ default: module.AdminLogin })),
)
const AdminDashboard = lazy(() =>
  import('./pages/admin/Dashboard').then((module) => ({ default: module.AdminDashboard })),
)
const AdminProducts = lazy(() =>
  import('./pages/admin/AdminProducts').then((module) => ({ default: module.AdminProducts })),
)
const AdminSettings = lazy(() =>
  import('./pages/admin/AdminSettings').then((module) => ({ default: module.AdminSettings })),
)
const ProductEditor = lazy(() =>
  import('./pages/admin/ProductEditor').then((module) => ({ default: module.ProductEditor })),
)

const base = import.meta.env.BASE_URL
const basename = base === '/' ? '/' : base.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <ToastProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="tienda" element={<Shop />} />
              <Route path="mayor" element={<Wholesale />} />
              <Route path="producto/:slug" element={<ProductPage />} />
              <Route path="carrito" element={<CartPage />} />
              <Route path="ayuda" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProducts />} />
              <Route path="productos/nuevo" element={<ProductEditor />} />
              <Route path="productos/:id" element={<ProductEditor />} />
              <Route path="ajustes" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  )
}
