import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Sun, Moon, LogOut, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { currentUser, isAdmin, loginWithGoogle, logout } = useAuth();
  const { items, setIsCartOpen } = useCart();

  const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('krypton-theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        return savedTheme;
      }
    }
    return 'dark';
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('krypton-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // { passive: true } mejora el rendimiento del scroll en móvil hasta 30%
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={() => window.scrollTo(0,0)}>
          <img src="/crystal-icon.png" alt="Krypton Logo" className="logo-img" />
          <span className="logo-text">KRYPTON</span>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => { setMobileMenuOpen(false); window.scrollTo({top: 0, behavior: 'smooth'}); }} className={currentPath === '/' ? 'active' : ''}>Inicio</Link>
          <Link to="/about" onClick={() => { setMobileMenuOpen(false); window.scrollTo({top: 0, behavior: 'smooth'}); }} className={currentPath === '/about' ? 'active' : ''}>Nosotros</Link>
          <Link to="/store" onClick={() => { setMobileMenuOpen(false); window.scrollTo({top: 0, behavior: 'smooth'}); }} className={currentPath === '/store' ? 'active' : ''}>Tienda</Link>
          <Link to="/custom" onClick={() => { setMobileMenuOpen(false); window.scrollTo({top: 0, behavior: 'smooth'}); }} className={currentPath === '/custom' ? 'active' : ''}>Personalizado</Link>
        </nav>

        <div className="nav-actions">
          {isAdmin && (
            <Link to="/admin" className="nav-action-btn" title="Panel de Administración" style={{ color: 'var(--krypton-green)', display: 'flex', alignItems: 'center' }}>
              <Settings size={22} />
            </Link>
          )}
          <button className="nav-action-btn theme-toggle-btn" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          
          {currentUser ? (
             <div className="profile-menu-wrapper">
               <button className="nav-action-btn profile-btn" onClick={() => setProfileMenuOpen(!profileMenuOpen)} title={`Perfil de ${currentUser.displayName}`}>
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="user-avatar" />
                ) : (
                  <User size={22} />
                )}
               </button>
               {profileMenuOpen && (
                 <div className="profile-dropdown glass-panel">
                   <div className="dropdown-header">
                     <p className="dropdown-name">{currentUser.displayName}</p>
                     <p className="dropdown-email">{currentUser.email}</p>
                   </div>
                   <button className="dropdown-logout" onClick={() => { logout(); setProfileMenuOpen(false); }}>
                     <LogOut size={16} /> Cerrar Sesión
                   </button>
                 </div>
               )}
             </div>
          ) : (
             <button className="nav-action-btn profile-btn" onClick={loginWithGoogle} title="Iniciar sesión para comprar">
              <User size={22} />
             </button>
          )}

          <button className="nav-action-btn cart-toggle-btn" onClick={() => setIsCartOpen(true)} title="Ver carrito">
            <ShoppingCart size={22} />
            <span className="cart-badge">{items.length}</span>
          </button>
          
          <button className="mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
