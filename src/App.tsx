import { Routes, Route, Navigate } from 'react-router-dom';

import routes from './routes';
import { Navbar } from '@/components/layouts/Navbar';
import { TopBar } from '@/components/brickstore/TopBar';
import { BrickStoreHeader } from '@/components/brickstore/BrickStoreHeader';
import { PageLayout } from '@/components/layouts/PageLayout';
import { BottomNav } from '@/components/layouts/BottomNav';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import { ScrollToTop } from '@/components/ScrollToTop';
import { FloatingWhatsAppButton } from '@/components/ui/FloatingWhatsAppButton';

function App() {
  const adminRoutes = routes.filter((route) => route.path.startsWith('/admin'));
  const publicRoutes = routes.filter((route) => !route.path.startsWith('/admin'));

  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes (no navbar/footer) */}
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

          {/* All Public Routes (with TopBar + BrickStoreHeader + Footer) */}
          {publicRoutes.map((route, index) => (
            <Route
              key={`public-${index}`}
              path={route.path}
              element={
                <div className="flex flex-col min-h-screen">
                  <TopBar />
                  <BrickStoreHeader />
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

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
