import React, { useMemo } from 'react';
import Hero from '../components/Hero.tsx';
import CategorySection from '../components/CategorySection.tsx';
import Facilities from '../components/Facilities.tsx';
import TrustedCompanies from '../components/TrustedCompanies.tsx';
import { useCategories } from '../hooks/useCategories.ts';
import { useProducts } from '../hooks/useProducts.ts';

const HomeView: React.FC = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts();

  const homeCategories = useMemo(() => {
    return categories
      .filter(c => c.showOnHome)
      .sort((a, b) => (a.homeOrder || 0) - (b.homeOrder || 0));
  }, [categories]);

  if (categoriesLoading || productsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', backgroundColor: 'var(--bg-dark)' }}>
        <div className="title-krypton static-white-glow" style={{ fontSize: '2rem', animation: 'fadeIn 1s infinite alternate' }}>CARGANDO UNIVERSO...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Hero />
      <TrustedCompanies />
      
      <div className="container sections-wrapper">
        {homeCategories.map(cat => {
          // Obtener productos activos de esta categoría
          const catProducts = products.filter(p => p.category === cat.slug && p.isActive !== false);
          
          // Filtrar los destacados
          let displayProducts = catProducts.filter(p => p.isFeatured);
          
          // Si no hay destacados, mostrar los 4 más recientes por defecto
          if (displayProducts.length === 0) {
            displayProducts = catProducts.slice(0, 4);
          }

          if (displayProducts.length === 0) return null;

          return (
            <CategorySection 
              key={cat.id}
              id={cat.slug}
              title={cat.name} 
              shortTitle={cat.shortName}
              items={displayProducts.map(p => ({
                id: p.id as unknown as number, // Compatibilidad con la interfaz estricta actual de CategorySection
                title: p.title,
                image: p.image,
                price: p.price
              }))}
            />
          );
        })}
      </div>
      
      <Facilities />
    </div>
  );
};

export default HomeView;
