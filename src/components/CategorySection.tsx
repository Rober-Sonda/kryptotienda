import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard.tsx';
import './CategorySection.css';

interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
}

interface CategorySectionProps {
  id: string;
  title: string;
  items: Product[];
  shortTitle?: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ id, title, items, shortTitle }) => {
  const navigate = useNavigate();
  
  return (
    <section id={id} className="category-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="section-line"></div>
      </div>
      
      <div className="product-grid">
        {items.map((item) => (
          <ProductCard 
            key={item.id}
            id={item.id}
            title={item.title} 
            image={item.image} 
            price={item.price} 
          />
        ))}
      </div>
      
      <div className="view-more-container">
        <button 
          className="neon-btn view-more-btn"
          onClick={() => navigate(`/store?category=${id}`)}
        >
          Ver más de {shortTitle || title.split(' ')[0]}
        </button>
      </div>
    </section>
  );
};

export default CategorySection;
