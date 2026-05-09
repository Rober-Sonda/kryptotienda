import React from 'react';
import { ShoppingCart } from 'lucide-react';
import QuickViewModal from './QuickViewModal.tsx';
import './ProductCard.css';

interface ProductCardProps {
  id: string | number;
  title: string;
  image: string;
  price: string;
  offerPrice?: string;
  mockupBg?: 'black' | 'white';
  isMadeToOrder?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, image, price, offerPrice, mockupBg, isMadeToOrder }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenQuickView = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="product-card glass-panel protected-media" onClick={handleOpenQuickView} style={{ cursor: 'pointer' }}>
      <div className="product-image-container">
        {/* Usamos un div superpuesto transparente para evitar el arrastre y click derecho incluso en dispositivos móviles */}
        <div className="glass-shield"></div>
        {mockupBg ? (
          <div className="virtual-mockup-container">
            <img src={`/mockups/mockup-tshirt-${mockupBg}.png`} alt="T-Shirt Mockup" className={`mockup-base ${mockupBg}`} draggable="false" />
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
          {offerPrice ? (
            <p className="product-price">
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8em', marginRight: '5px' }}>{price}</span>
              <span style={{ color: 'var(--krypton-green)' }}>{offerPrice}</span>
            </p>
          ) : (
            <p className="product-price">{price}</p>
          )}
          {isMadeToOrder && <span style={{ display: 'inline-block', backgroundColor: 'rgba(255,165,0,0.2)', color: 'orange', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', marginTop: '4px' }}>Por Pedido</span>}
        </div>
        <button className="mobile-cart-btn" onClick={(e) => { e.stopPropagation(); handleOpenQuickView(); }}>
          <ShoppingCart size={20} />
        </button>
      </div>
      </div>
      {isModalOpen && (
        <QuickViewModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={{id, title, image, price, offerPrice, mockupBg, isMadeToOrder}} 
        />
      )}
    </>
  );
};
export default React.memo(ProductCard);
