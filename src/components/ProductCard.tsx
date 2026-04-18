import React from 'react';
import { ShoppingCart } from 'lucide-react';
import QuickViewModal from './QuickViewModal.tsx';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  price: string;
  mockupBg?: 'black' | 'white';
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, image, price, mockupBg }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenQuickView = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="product-card glass-panel protected-media" onClick={handleOpenQuickView} style={{ cursor: 'pointer' }}>
      <div className="product-image-container">
        {/* Usamos un div superpuesto transparente para evitar el arrastre y click derecho incluso en dispositivos móviles */}
        <div className="glass-shield"></div>
        {mockupBg ? (
          <div className="virtual-mockup-container" style={{ backgroundColor: mockupBg === 'black' ? '#111' : '#fff' }}>
            <img src="/mockups/mockup-tshirt.png" alt="T-Shirt Mockup" className={`mockup-base ${mockupBg}`} draggable="false" />
            <img src={image} alt={title} className="mockup-design no-drag" draggable="false" onContextMenu={(e) => e.preventDefault()} />
          </div>
        ) : (
          <img 
            src={image} 
            alt={title} 
            className="product-image no-drag"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        )}
        <div className="product-overlay">
          <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); handleOpenQuickView(); }}>
            <ShoppingCart size={20} />
            <span>Equipar / Talles</span>
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-text">
          <h3 className="product-title">{title}</h3>
          <p className="product-price">{price}</p>
        </div>
        <button className="mobile-cart-btn" onClick={(e) => { e.stopPropagation(); handleOpenQuickView(); }}>
          <ShoppingCart size={20} />
        </button>
      </div>

      <QuickViewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={{id, title, image, price, mockupBg}} 
      />
    </div>
  );
};

export default ProductCard;
