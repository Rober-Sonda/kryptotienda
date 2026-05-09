import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Database, ArrowLeft } from 'lucide-react';
import './Admin.css';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>KRYPTON ADMIN</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/products" className={`admin-link ${location.pathname.includes('/products') ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Productos
          </Link>
          <Link to="/admin/settings" className={`admin-link ${location.pathname.includes('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            Configuración
          </Link>
          <Link to="/admin/migration" className={`admin-link ${location.pathname.includes('/migration') ? 'active' : ''}`}>
            <Database size={20} />
            Migración
          </Link>
        </nav>
        <div className="admin-footer-nav">
          <Link to="/" className="admin-link">
            <ArrowLeft size={20} />
            Volver a Tienda
          </Link>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
