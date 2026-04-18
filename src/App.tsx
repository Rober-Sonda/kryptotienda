import { useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import HomeView from './views/HomeView.tsx';
import StoreView from './views/StoreView.tsx';
import CustomDesignView from './views/CustomDesignView.tsx';
import AboutView from './views/AboutView.tsx';
import CartSidebar from './components/CartSidebar.tsx';
import AuthModal from './components/AuthModal.tsx';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {

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
      <Navbar />
      <CartSidebar />
      
      <main>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/store" element={<StoreView />} />
          <Route path="/custom" element={<CustomDesignView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="*" element={
            <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
              <h2 className="title-krypton" style={{ fontSize: '3rem' }}>Error 404</h2>
              <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Esta ruta no existe en nuestro universo. Vuelve al menú.</p>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

export default App;
