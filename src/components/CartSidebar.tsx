import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Trash2, ShoppingBag, LogIn, CheckCircle } from 'lucide-react';
import { useOrders, useOrderWhatsApp } from '../hooks/useOrders';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

const CartSidebar: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { currentUser, loginWithGoogle } = useAuth();

  const [cp, setCp] = useState('');
  const [shippingOptions, setShippingOptions] = useState<{id: string, label: string, cost: number}[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<{id: string, label: string, cost: number} | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const { addOrder } = useOrders();
  const { generateMessage } = useOrderWhatsApp();
  const navigate = useNavigate();
  
  // Checkout Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    apto: '',
    notes: ''
  });

  // Limpiar envíos y vistas al cerrar el carrito
  useEffect(() => {
    if(!isCartOpen) {
      setCp('');
      setShippingOptions([]);
      setSelectedShipping(null);
      setShowCheckoutForm(false);
      setOrderConfirmed(false);
      setConfirmedOrder(null);
    }
  }, [isCartOpen]);

  const finalTotal = cartTotal + (selectedShipping ? selectedShipping.cost : 0);

  const handleCalculateShipping = async () => {
    if (!cp || cp.trim().length < 4) return;
    const cleanCp = cp.trim();
    setIsCalculating(true);

    try {
      // Connect to our robust Firebase Cloud Function proxy for real-time calculation
      const response = await fetch(`https://us-central1-krypton-tienda.cloudfunctions.net/calculateShipping?cp=${encodeURIComponent(cleanCp)}`);
      if (!response.ok) throw new Error('Error al conectar con calculador de envíos');
      
      const options = await response.json();
      setShippingOptions(options);
      
      if (options.length > 0) {
        setSelectedShipping(options[0]);
      }
    } catch (error) {
      console.warn("Backend no disponible (Google Cloud pendiente). Usando calculador Fallback Interno...", error);
      
      // Fallback a lógica interna de React (Idéntica a la que corre en el backend)
      let options = [];
      if (cleanCp === '6500') {
        options.push({ id: 'local', label: 'Retiro en Sucursal (9 de Julio)', cost: 0 });
        options.push({ id: 'moto', label: 'Cadete Motorizado Local', cost: 2000 });
      } else {
        const firstDigit = cleanCp.charAt(0);
        let sucursalCost = 8500;
        let domicilioCost = 12000;
        
        if (['4', '5', '8', '9'].includes(firstDigit)) {
          sucursalCost = 13500;
          domicilioCost = 19500;
        } else {
          sucursalCost = 9200;
          domicilioCost = 14500;
        }
        
        options.push({ id: 'andreani_suc', label: 'Envío a Sucursal Andreani (Fallback)', cost: sucursalCost });
        options.push({ id: 'andreani_dom', label: 'Envío Domicilio Estándar (Fallback)', cost: domicilioCost });
      }
      
      setShippingOptions(options);
      setSelectedShipping(options[0]);
    } finally {
      setIsCalculating(false);
    }
  };

  if (!isCartOpen) return null;

  const handlePlaceOrder = async () => {
    if (!currentUser || !formData.name || !formData.phone) {
      alert("Por favor completa tu nombre y teléfono.");
      return;
    }
    
    setIsCalculating(true);
    try {
      const order = {
        customerId: currentUser.uid,
        customerName: formData.name,
        customerPhone: formData.phone,
        items: items.map(item => ({
          productId: String(item.id),
          title: item.title,
          price: String(item.price),
          quantity: item.quantity,
          size: item.size,
          image: item.image
        })),
        total: finalTotal,
        status: 'pending' as const
      };
      
      const newOrderId = await addOrder(order);
      setConfirmedOrder({ id: newOrderId, ...order, createdAt: Date.now() });
      setOrderConfirmed(true);
      clearCart();
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pedido.");
    }
    setIsCalculating(false);
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        
        <div className="cart-header">
          {!showCheckoutForm ? (
            <h2><ShoppingBag size={24} /> Tu Carrito</h2>
          ) : (
            <h2>Checkout Seguro (2/2)</h2>
          )}
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {!currentUser && (
          <div className="cart-auth-warning">
            <p>Para armar tu pedido necesitas identificarte</p>
            <button className="neon-btn small-btn" onClick={loginWithGoogle}>
              <LogIn size={18} /> Iniciar con Google
            </button>
          </div>
        )}

        {!showCheckoutForm ? (
          <>
            <div className="cart-items">
              {items.length === 0 ? (
                <div className="empty-cart">
                  <p>El carrito está vacío. ¡Ve a la tienda a buscar algo épico!</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.cartItemId} className="cart-item">
                    <img src={item.image} alt={item.title} className="cart-item-image no-drag" />
                    <div className="cart-item-details">
                      <h4>{item.title} {item.size ? `(Talle: ${item.size})` : ''}</h4>
                      <p className="cart-item-price">{item.price}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.cartItemId)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="shipping-calculator">
                <h4>Estimar Envío</h4>
                <div className="shipping-input-group">
                  <input 
                    type="text" 
                    placeholder="Tu Código Postal (Ej: 6500)" 
                    value={cp} 
                    onChange={(e) => setCp(e.target.value)} 
                    maxLength={8}
                  />
                  <button 
                    className="neon-btn small-btn" 
                    onClick={handleCalculateShipping}
                    disabled={isCalculating}
                  >
                    {isCalculating ? 'Cotizando...' : 'Calcular'}
                  </button>
                </div>
                
                {shippingOptions.length > 0 && (
                  <div className="shipping-options-list">
                    {shippingOptions.map(opt => (
                      <label key={opt.id} className="shipping-option-label">
                        <input 
                          type="radio" 
                          name="shipping_option" 
                          checked={selectedShipping?.id === opt.id}
                          onChange={() => setSelectedShipping(opt)}
                        />
                        <span className="shipping-opt-text">{opt.label}</span>
                        <span className="shipping-opt-cost">{opt.cost === 0 ? 'Gratis' : `$${opt.cost}`}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="cart-footer">
              <div className="cart-total">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {selectedShipping && (
                <div className="cart-shipping-cost">
                  <span>Envío:</span>
                  <span>{selectedShipping.cost === 0 ? 'Gratis' : `$${selectedShipping.cost.toFixed(2)}`}</span>
                </div>
              )}
              <div className="cart-final-total">
                <span>Total Final:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              <button 
                className="neon-btn checkout-btn" 
                disabled={items.length === 0}
                onClick={() => {
                  if(!currentUser) {
                    loginWithGoogle();
                    return;
                  }
                  setShowCheckoutForm(true);
                }}
              >
                {currentUser ? 'Continuar al Checkout' : 'Inicia Sesión para Comprar'}
              </button>
            </div>
          </>
        ) : (
          <div className="checkout-form-container">
            {orderConfirmed && confirmedOrder ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <CheckCircle size={64} color="var(--krypton-green)" />
                <h3 className="title-krypton">¡Pedido Confirmado!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Tu pedido se ha guardado exitosamente. Podrás ver su estado desde tu perfil.</p>
                
                <button 
                  className="neon-btn" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    const waLink = generateMessage(confirmedOrder);
                    window.open(waLink, '_blank');
                  }}
                >
                  Confirmar por WhatsApp
                </button>
                
                <button 
                  className="neon-btn small-btn" 
                  style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)' }}
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/mis-pedidos');
                  }}
                >
                  Ver Mis Pedidos
                </button>
              </div>
            ) : (
              <>
                <button className="back-to-cart-btn" onClick={() => setShowCheckoutForm(false)}>
                  ← Volver al carrito
                </button>
                <div className="checkout-fast-form">
                  <input type="text" placeholder="Nombre Completo *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="text" placeholder="Teléfono / Celular *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <input type="text" placeholder="Ciudad (Ej: 9 de Julio)" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              <input type="text" placeholder="Dirección (Calle y No.)" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <input type="text" placeholder="Piso / Depto (Opcional)" value={formData.apto} onChange={e => setFormData({...formData, apto: e.target.value})} />
              <textarea placeholder="Notas adicionales del pedido o talle..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3}></textarea>
            </div>
            
            <div className="cart-footer" style={{marginTop: 'auto'}}>
                <div className="cart-final-total">
                  <span>Total Final:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
                <button 
                  className="neon-btn checkout-btn" 
                  disabled={!formData.name || !formData.phone || isCalculating}
                  onClick={handlePlaceOrder}
                >
                  {isCalculating ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
