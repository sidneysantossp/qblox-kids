import { Routes, Route, matchPath, useLocation } from 'react-router-dom';

import routes from './routes';
import { TopBar } from '@/components/brickstore/TopBar';
import { BrickStoreHeader } from '@/components/brickstore/BrickStoreHeader';
import { PageLayout } from '@/components/layouts/PageLayout';
import { BottomNav } from '@/components/layouts/BottomNav';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Toaster } from '@/components/ui/toaster';
import { ScrollToTop } from '@/components/ScrollToTop';
import { FloatingWhatsAppButton } from '@/components/ui/FloatingWhatsAppButton';
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress';

function AppShell() {
  const location = useLocation();
  const { cartTotal } = useCart();
  const adminRoutes = routes.filter((route) => route.path.startsWith('/admin'));
  const publicRoutes = routes.filter((route) => !route.path.startsWith('/admin'));
  const isProductDetailRoute = Boolean(matchPath('/produto/:id', location.pathname));

  return (
    <>
      <ScrollToTop />
      <Routes>
        {adminRoutes.map((route, index) => (
          <Route key={`admin-${index}`} path={route.path} element={route.element}>
            {route.children?.map((child, childIndex) => (
              <Route
                key={`admin-child-${childIndex}`}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}

        {publicRoutes.map((route, index) => (
          <Route
            key={`public-${index}`}
            path={route.path}
            element={
              <div className="flex flex-col min-h-screen">
                <TopBar />
                <BrickStoreHeader />
                {isProductDetailRoute && (
                  <div className="hidden md:block border-b bg-white/95">
                    <div className="container mx-auto px-4 py-3">
                      <FreeShippingProgress cartTotal={cartTotal} variant="banner" />
                    </div>
                  </div>
                )}
                <main className="flex-grow pb-16 xl:pb-0">
                  <PageLayout>
                    {route.element}
                  </PageLayout>
                </main>
                <BottomNav />
                <FloatingWhatsAppButton />
              </div>
            }
          />
        ))}
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
