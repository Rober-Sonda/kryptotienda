import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsData } from '../data/products.ts';
import ProductCard from '../components/ProductCard.tsx';
import { Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import './StoreView.css';

const categories = [
  { id: 'all',  name: 'Todos los Archivos' },
  { id: 'anime', name: 'Anime' },
  { id: 'retro', name: 'Retro Gaming' },
  { id: 'gym', name: 'Fitness & Gym' },
  { id: 'simpsons', name: 'Clásicos 90s' },
  { id: 'argentina', name: 'Argentina' }
];

const StoreView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(categoryParam && categoryParam !== 'all' ? categoryParam : null);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setActiveSubcategory('all');
      if (categoryParam !== 'all') {
        setExpandedCategory(categoryParam);
      }
    }
  }, [categoryParam]);

  const handleCategoryClick = (catId: string) => {
    if (catId === 'all') {
      setActiveCategory('all');
      setActiveSubcategory('all');
      setExpandedCategory(null);
      setIsMobileMenuOpen(false);
    } else {
      if (expandedCategory === catId) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(catId);
      }
      setActiveCategory(catId);
      setActiveSubcategory('all');
    }
  };

  const handleSubcategoryClick = (catId: string, subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCategory(catId);
    setActiveSubcategory(subId);
    setIsMobileMenuOpen(false);
  };

  const subcategoriesMap = useMemo(() => {
    const map = new Map<string, string[]>();
    categories.forEach(cat => {
      if (cat.id === 'all') { map.set(cat.id, []); return; }
      const subs = new Set(
        productsData
          .filter(p => p.category === cat.id && p.subcategory)
          .map(p => p.subcategory as string)
      );
      map.set(cat.id, Array.from(subs));
    });
    return map;
  }, []);

  const filteredProducts = useMemo(() => {
    let prods = productsData;
    if (activeCategory !== 'all') {
      prods = prods.filter(p => p.category === activeCategory);
    }
    if (activeSubcategory !== 'all') {
      prods = prods.filter(p => p.subcategory === activeSubcategory);
    }
    return prods;
  }, [activeCategory, activeSubcategory]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderSidebarContent = () => (
    <div className="sidebar-content">
      <h3 className="sidebar-title">Bases de Datos</h3>
      <ul className="category-list">
        {categories.map(cat => {
          const subs = subcategoriesMap.get(cat.id) || [];
          const hasSubs = subs.length > 0;
          const isExpanded = expandedCategory === cat.id;
          const isActive = activeCategory === cat.id;

          return (
            <li key={cat.id} className={`category-item ${isActive ? 'active' : ''}`}>
              <button 
                className="category-btn"
                onClick={() => handleCategoryClick(cat.id)}
              >
                <span className="category-name">{cat.name}</span>
                {hasSubs && (
                  <span className="category-icon">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>
                )}
                {cat.id === 'all' && isActive && <span className="active-indicator"></span>}
              </button>
              
              {hasSubs && (
                <ul className={`subcategory-list ${isExpanded ? 'expanded' : ''}`}>
                  <li className={`subcategory-item ${isActive && activeSubcategory === 'all' ? 'active' : ''}`}>
                    <button onClick={(e) => handleSubcategoryClick(cat.id, 'all', e)}>
                      <span className="sub-deco">└</span> Ver Todo {cat.name}
                    </button>
                  </li>
                  {subs.map(sub => (
                    <li key={sub} className={`subcategory-item ${isActive && activeSubcategory === sub ? 'active' : ''}`}>
                      <button onClick={(e) => handleSubcategoryClick(cat.id, sub, e)}>
                        <span className="sub-deco">└</span> {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="store-view-container fade-in">
      <div className="store-hero container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>
          <span>Tienda </span>
          <span className="title-krypton">KRYPTON</span>
        </h1>
        <p className="krypton-lore" style={{ textAlign: 'center' }}>
          Forjado en los confines del espacio, este ecosistema nació para que vistas y abraces tus mayores aficiones con orgullo. Entra, filtra tu especialidad, y descubre tu <strong style={{fontFamily: 'var(--font-edo)', fontSize: '1.4em', fontWeight: 'normal', color: 'var(--krypton-green)', letterSpacing: '1px', textShadow: '0 0 10px rgba(57, 255, 20, 0.4)'}}>GRAN DEBILIDAD</strong>.
        </p>
      </div>
      
      <div className="store-layout container">
        
        <div className="mobile-filter-bar">
          <button className="neon-btn filter-btn" onClick={toggleMobileMenu}>
            <Filter size={18} /> Categorías
          </button>
          <span className="results-count text-muted">{filteredProducts.length} items</span>
        </div>

        <aside className="store-sidebar desktop-only glass-panel">
          {renderSidebarContent()}
        </aside>

        <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
          <aside className={`store-sidebar mobile-sidebar glass-panel ${isMobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sidebar-header">
              <h2>Navegador</h2>
              <button className="close-sidebar-btn" onClick={toggleMobileMenu}><X size={24} /></button>
            </div>
            {renderSidebarContent()}
          </aside>
        </div>

        <div className="store-products">
          <div className="desktop-results-bar">
            <h2 className="current-category-title">
              {activeCategory === 'all' ? 'Todos los Archivos' : categories.find(c => c.id === activeCategory)?.name}
              {activeSubcategory !== 'all' && <span className="sub-title-badge">/ {activeSubcategory}</span>}
            </h2>
            <span className="results-count text-muted">{filteredProducts.length} expedientes</span>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
               <ProductCard 
                 key={product.id}
                 id={product.id}
                 title={product.title}
                 image={product.image}
                 price={product.price}
                 mockupBg={product.mockupBg}
               />
             ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="empty-catalog text-center text-muted" style={{padding: '5rem 0'}}>
              <p>No se encontraron rastros galácticos en esta sección.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreView;
