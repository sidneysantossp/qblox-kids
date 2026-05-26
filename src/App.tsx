import { Routes, Route, matchPath, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress';
import { Button } from '@/components/ui/button';

const COOKIE_BANNER_STORAGE_KEY = 'cookie-banner-consent';

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_BANNER_STORAGE_KEY);
    setIsVisible(consent !== 'accepted');
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_BANNER_STORAGE_KEY, 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border bg-white p-4 shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Cookies: usamos cookies para personalizar anúncios e melhorar sua experiência.</p>
          <p className="text-sm text-muted-foreground">
            Ao continuar navegando, você concorda com o nosso{' '}
            <Link to="/politica-de-privacidade" className="font-medium text-primary hover:underline">
              Aviso de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button type="button" onClick={handleAccept} className="bg-[#FFD200] text-[#111827] hover:bg-[#F5C400]">
            Aceitar
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/politica-de-privacidade">Preferências</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

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
                <CookieBanner />
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
