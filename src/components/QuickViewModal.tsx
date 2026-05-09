import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, Ruler } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import './QuickViewModal.css';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string | number;
    title: string;
    image: string;
    price: string;
    offerPrice?: string;
    mockupBg?: 'black' | 'white';
    isMadeToOrder?: boolean;
  } | null;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, product }) => {
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [showGuide, setShowGuide] = useState(false);
  const { currentUser, setShowLoginPrompt } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!product || !isOpen) return null;

  const handleAddToCart = () => {
    if (!currentUser) {
      onClose(); // Close modal first
      setShowLoginPrompt(true);
      return;
    }
    
    addToCart({ 
      id: product.id, 
      title: product.title, 
      image: product.image, 
      price: product.offerPrice || product.price,
      size: selectedSize
    });
    
    onClose();
  };

  return createPortal(
    <div className={`quickview-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => { e.stopPropagation(); if(e.target === e.currentTarget) onClose(); }}>
      <div className="quickview-modal">
        <div className="qv-image-section">
          <div className="glass-shield"></div>
          {product.mockupBg ? (
            <div className="virtual-mockup-container">
              <img src={`/mockups/mockup-tshirt-${product.mockupBg}.png`} alt="T-Shirt Mockup" className={`mockup-base ${product.mockupBg}`} draggable="false" />
              <img src={product.image} alt={product.title} className="mockup-design no-drag" draggable="false" onContextMenu={e => e.preventDefault()} />
            </div>
          ) : (
            <img src={product.image} alt={product.title} className="qv-image no-drag" onContextMenu={e => e.preventDefault()} />
          )}
        </div>
        
        <div className="qv-details">
          <h2 className="qv-title">{product.title}</h2>
          {product.offerPrice ? (
            <p className="qv-price">
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8em', marginRight: '10px' }}>{product.price}</span>
              <span style={{ color: 'var(--krypton-green)' }}>{product.offerPrice}</span>
            </p>
          ) : (
            <p className="qv-price">{product.price}</p>
          )}
          {product.isMadeToOrder && <p style={{ color: 'orange', fontSize: '0.9rem', marginBottom: '15px' }}>⚠️ Producto fabricado por pedido (Stock exclusivo).</p>}
          
          <div className="qv-size-selector">
            <h4>Selecciona tu Armadura</h4>
            <div className="size-grid">
              {SIZES.map(size => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            
            <div style={{marginTop: '1rem'}}>
              <button 
                onClick={() => setShowGuide(!showGuide)} 
                style={{background:'transparent', border:'none', color:'var(--krypton-green)', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.85rem'}}
              >
                <Ruler size={16} /> Ver Guía de Talles (Holograma)
              </button>
            </div>
            
            {showGuide && (
              <div className="size-guide">
                <p>Medidas estándar aproximadas en centímetros (Ancho x Largo):</p>
                <table className="size-guide-table">
                  <tbody>
                    <tr><th>S</th><td>51 x 68 cm</td></tr>
                    <tr><th>M</th><td>53 x 70 cm</td></tr>
                    <tr><th>L</th><td>57 x 72 cm</td></tr>
                    <tr><th>XL</th><td>58 x 74 cm</td></tr>
                    <tr><th>XXL</th><td>59 x 75 cm</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <button className="neon-btn qv-add-btn" onClick={handleAddToCart}>
            <ShoppingCart size={22} /> Equipar al Carrito
          </button>
        </div>
        
        <button className="qv-close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}><X size={20} /></button>
      </div>
    </div>,
    document.body
  );
};

export default QuickViewModal;
