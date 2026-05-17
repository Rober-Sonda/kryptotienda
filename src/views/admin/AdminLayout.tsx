import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, Tags, Settings, Database, ArrowLeft, Image as ImageIcon, ShoppingCart, DollarSign, Bot, Briefcase } from 'lucide-react';
import './Admin.css';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2 className="title-krypton" style={{ fontSize: '1.5rem', margin: 0 }}>KRYPTON ADMIN</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/products" className={`admin-link ${location.pathname.includes('/products') ? 'active' : ''}`}>
            <Package size={20} />
            Productos
          </Link>
          <Link to="/admin/categories" className={`admin-link ${location.pathname.includes('/categories') ? 'active' : ''}`}>
            <Tags size={20} />
            Categorías
          </Link>
          <Link to="/admin/facilities" className={`admin-link ${location.pathname.includes('/facilities') ? 'active' : ''}`}>
            <ImageIcon size={20} />
            Instalaciones
          </Link>
          <Link to="/admin/settings" className={`admin-link ${location.pathname.includes('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            Configuración
          </Link>
          <Link to="/admin/raw-materials" className={`admin-link ${location.pathname.includes('/raw-materials') ? 'active' : ''}`}>
            <Database size={20} />
            Materia Prima
          </Link>
          <Link to="/admin/sales" className={`admin-link ${location.pathname.includes('/sales') ? 'active' : ''}`}>
            <Package size={20} />
            Ventas / Entregas
          </Link>
          <Link to="/admin/orders" className={`admin-link ${location.pathname.includes('/orders') ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            Pedidos
          </Link>
          <Link to="/admin/finances" className={`admin-link ${location.pathname.includes('/finances') ? 'active' : ''}`}>
            <DollarSign size={20} />
            Finanzas
          </Link>
          <Link to="/admin/companies" className={`admin-link ${location.pathname.includes('/companies') ? 'active' : ''}`}>
            <Briefcase size={20} />
            Empresas
          </Link>
          <Link to="/admin/migration" className={`admin-link ${location.pathname.includes('/migration') ? 'active' : ''}`}>
            <Settings size={20} />
            Migración
          </Link>
          <Link to="/admin/assistant" className={`admin-link ${location.pathname.includes('/assistant') ? 'active' : ''}`} style={{ borderTop: '1px solid var(--border-color)', marginTop: '10px', paddingTop: '10px' }}>
            <Bot size={20} color="var(--krypton-green)" />
            <span style={{ color: 'var(--krypton-green)' }}>Asistente IA</span>
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
