import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsData } from '../data/products.ts';
import ProductCard from '../components/ProductCard.tsx';
import './StoreView.css';

const categories = [
  { id: 'all',  name: 'Todos' },
  { id: 'anime', name: 'Anime' },
  { id: 'retro', name: 'Retro Gaming' },
  { id: 'gym', name: 'Fitness & Gym' },
  { id: 'simpsons', name: 'Clásicos 90s' },
  { id: 'argentina', name: 'Escaloneta' }
];

const StoreView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  // Si cambia el parametro global, actualizar local
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setActiveSubcategory('all');
    }
  }, [categoryParam]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setActiveSubcategory('all'); // Siempre al cambiar categoría padre, el hijo vuelve a 'Todos'
  };

  // Dinámicamente obtiene la lista de subcategorías válidas para la categoría activa
  const availableSubcategories = useMemo(() => {
    if (activeCategory === 'all') return [];
    
    const subs = new Set(
      productsData
        .filter(p => p.category === activeCategory && p.subcategory)
        .map(p => p.subcategory as string)
    );
    return Array.from(subs);
  }, [activeCategory]);

  // Filtra matriz de productos basados en categoría y luego subcategoría
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

  return (
    <div className="store-view-container fade-in">
      {/* Sección Hero y Entorno Identitario de Krypton */}
      <div className="store-hero container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>
          <span>Catálogo </span>
          <span className="title-krypton">KRYPTON</span>
        </h1>
        <p className="krypton-lore" style={{ textAlign: 'center' }}>
          Forjado en los confines del espacio, este ecosistema nació para que vistas y abraces tus mayores aficiones con orgullo. Entra, filtra tu especialidad, y descubre tu <strong>GRAN DEBILIDAD</strong>.
        </p>
      </div>
      
      {/* Interfaz HUD Sci-Fi */}
      <div className="store-navigation container">
        <div className="hud-tab-container">
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`hud-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span className="hud-tab-text">{cat.name.toUpperCase()}</span>
              <span className="hud-tab-deco"></span>
            </button>
          ))}
        </div>

        {/* Nodos de Datos (Subcategorías) */}
        <div className={`hud-chip-container ${availableSubcategories.length > 0 ? 'visible' : ''}`}>
          {availableSubcategories.length > 0 && (
            <>
              <button 
                className={`hud-chip ${activeSubcategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveSubcategory('all')}
              >
                <span className="chip-label">SYS.ALL</span>
                <span className="chip-indicator"></span>
              </button>
              {availableSubcategories.map(sub => (
                <button 
                  key={sub}
                  className={`hud-chip ${activeSubcategory === sub ? 'active' : ''}`}
                  onClick={() => setActiveSubcategory(sub)}
                >
                  <span className="chip-label">{sub.toUpperCase()}</span>
                  <span className="chip-indicator"></span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="store-layout container">
        <div className="store-products">
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
