import { useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import HomeView from './views/HomeView.tsx';
import CartSidebar from './components/CartSidebar.tsx';
import AuthModal from './components/AuthModal.tsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const StoreView = lazy(() => import('./views/StoreView.tsx'));
const CustomDesignView = lazy(() => import('./views/CustomDesignView.tsx'));
const AboutView = lazy(() => import('./views/AboutView.tsx'));

// Admin Views
const AdminLayout = lazy(() => import('./views/admin/AdminLayout.tsx'));
const AdminProductsView = lazy(() => import('./views/admin/AdminProductsView.tsx'));
const AdminSettingsView = lazy(() => import('./views/admin/AdminSettingsView.tsx'));
const AdminMigrationView = lazy(() => import('./views/admin/AdminMigrationView.tsx'));

import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'img' || target.closest('.protected-media')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div className="app-container">
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartSidebar />}
      
      <main>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', backgroundColor: 'var(--bg-dark)' }}>
            <div className="title-krypton static-white-glow" style={{ fontSize: '2rem', animation: 'fadeIn 1s infinite alternate' }}>CARGANDO...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/store" element={<StoreView />} />
            <Route path="/custom" element={<CustomDesignView />} />
            <Route path="/about" element={<AboutView />} />
            
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminProductsView />} />
                <Route path="products" element={<AdminProductsView />} />
                <Route path="settings" element={<AdminSettingsView />} />
                <Route path="migration" element={<AdminMigrationView />} />
              </Route>
            </Route>

            <Route path="*" element={
              <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <h2 className="title-krypton" style={{ fontSize: '3rem' }}>Error 404</h2>
                <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Esta ruta no existe en nuestro universo. Vuelve al menú.</p>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
      <AuthModal />
    </div>
  );
}

export default App;
