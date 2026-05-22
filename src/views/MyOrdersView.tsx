import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders, useOrderWhatsApp, type Order } from '../hooks/useOrders';
import { useClaims } from '../hooks/useClaims';
import { Package, MessageCircle, Edit3, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import './StoreView.css';

const STATUS_MAP: Record<string, { label: string, color: string }> = {
  pending: { label: 'Pendiente', color: '#f39c12' },
  processing: { label: 'En Proceso', color: '#3498db' },
  shipped: { label: 'Enviado', color: '#9b59b6' },
  delivered: { label: 'Entregado', color: '#2ecc71' },
  cancelled: { label: 'Cancelado', color: '#e74c3c' }
};

const CLAIM_STATUS_MAP: Record<string, { label: string, color: string }> = {
  open: { label: 'Reclamo Abierto', color: '#e74c3c' },
  in_progress: { label: 'En Revisión', color: '#f39c12' },
  resolved: { label: 'Resuelto', color: '#2ecc71' },
  rejected: { label: 'Rechazado', color: '#7f8c8d' }
};

const MyOrdersView: React.FC = () => {
  const { currentUser } = useAuth();
  const { orders, loading, editOrderItems } = useOrders(currentUser?.uid);
  const { claims, addClaim } = useClaims(currentUser?.uid);
  const { generateMessage } = useOrderWhatsApp();

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editedItems, setEditedItems] = useState<any[]>([]);
  
  const [claimModalOrder, setClaimModalOrder] = useState<Order | null>(null);
  const [claimReason, setClaimReason] = useState('');

  if (!currentUser) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 className="title-krypton">Inicia Sesión</h2>
        <p>Debes iniciar sesión para ver tus pedidos.</p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Cargando tus pedidos...</div>;
  }

  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
    setEditedItems([...order.items]);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const newItems = [...editedItems];
    const item = newItems[index];
    if (item.quantity + delta > 0) {
      item.quantity += delta;
      setEditedItems(newItems);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...editedItems];
    newItems.splice(index, 1);
    setEditedItems(newItems);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder || !editingOrder.id) return;
    
    const newTotal = editedItems.reduce((acc, item) => acc + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    
    try {
      await editOrderItems(editingOrder.id, editedItems, newTotal);
      alert("Pedido actualizado correctamente. El administrador ha sido notificado.");
      
      const updatedOrder = { ...editingOrder, items: editedItems, total: newTotal, wasEdited: true };
      const waLink = generateMessage(updatedOrder);
      if(window.confirm("¿Deseas enviar esta actualización por WhatsApp ahora?")) {
        window.open(waLink, '_blank');
      }
      
      setEditingOrder(null);
    } catch (e) {
      console.error(e);
      alert("Hubo un error al actualizar el pedido.");
    }
  };

  const handleOpenClaimModal = (order: Order) => {
    setClaimModalOrder(order);
    setClaimReason('');
  };

  const handleSubmitClaim = async () => {
    if (!claimModalOrder || !claimModalOrder.id || !currentUser) return;
    if (claimReason.trim().length < 10) {
      alert("Por favor detalla más tu reclamo (mínimo 10 caracteres).");
      return;
    }
    
    try {
      await addClaim({
        orderNumber: claimModalOrder.orderNumber || claimModalOrder.id,
        orderId: claimModalOrder.id,
        customerId: currentUser.uid,
        customerName: currentUser.displayName || claimModalOrder.customerName || 'Cliente',
        reason: claimReason
      });
      alert("Tu reclamo ha sido enviado. Lo revisaremos a la brevedad.");
      setClaimModalOrder(null);
    } catch (error) {
      console.error(error);
      alert("Error al enviar el reclamo.");
    }
  };

  return (
    <div style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <h2 className="title-krypton" style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Package /> Mis Pedidos
      </h2>

      {orders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>Aún no has realizado ningún pedido.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-card" style={{ padding: '20px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>Pedido #{order.orderNumber || order.id?.substring(0, 8).toUpperCase()}</h3>
                  <span style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {(() => {
                    const existingClaim = claims.find(c => c.orderId === order.id);
                    if (existingClaim) {
                      return (
                        <span style={{ 
                          backgroundColor: CLAIM_STATUS_MAP[existingClaim.status]?.color || '#555', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.85em',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <AlertTriangle size={12} /> {CLAIM_STATUS_MAP[existingClaim.status]?.label}
                        </span>
                      );
                    }
                    return null;
                  })()}
                  <span style={{ 
                    backgroundColor: STATUS_MAP[order.status]?.color || '#555', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.85em',
                    fontWeight: 'bold'
                  }}>
                    {STATUS_MAP[order.status]?.label || order.status}
                  </span>
                </div>
              </div>

              {editingOrder?.id === order.id ? (
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Editando Artículos</h4>
                  {editedItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ flex: 1 }}>{item.title} {item.size ? `(${item.size})` : ''}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => handleUpdateQuantity(idx, -1)} style={{ padding: '2px 8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(idx, 1)} style={{ padding: '2px 8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}>+</button>
                        <button onClick={() => handleRemoveItem(idx)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', marginLeft: '10px' }}><XCircle size={18} /></button>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                    <button className="neon-btn small-btn" style={{ background: 'transparent' }} onClick={() => setEditingOrder(null)}>Cancelar</button>
                    <button className="neon-btn small-btn" onClick={handleSaveEdit}><CheckCircle size={16} /> Guardar Cambios</button>
                  </div>
                </div>
              ) : (
                <>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>{item.quantity}x {item.title} {item.size ? `(${item.size})` : ''}</span>
                        <span>${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '1.1em', marginTop: '10px' }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--krypton-green)' }}>${order.total.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <button 
                      className="neon-btn small-btn" 
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                      onClick={() => window.open(generateMessage(order), '_blank')}
                    >
                      <MessageCircle size={16} /> Re-enviar a WhatsApp
                    </button>
                    
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button 
                        className="neon-btn small-btn" 
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'transparent', border: '1px solid var(--krypton-green)' }}
                        onClick={() => handleEditClick(order)}
                      >
                        <Edit3 size={16} /> Editar Pedido
                      </button>
                    )}

                    {!claims.find(c => c.orderId === order.id) && (
                      <button 
                        className="neon-btn small-btn" 
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c' }}
                        onClick={() => handleOpenClaimModal(order)}
                      >
                        <AlertTriangle size={16} /> Iniciar Reclamo
                      </button>
                    )}
                  </div>
                  {order.wasEdited && (
                    <div style={{ marginTop: '10px', fontSize: '0.85em', color: '#f39c12', textAlign: 'center' }}>
                      ⏳ Has editado este pedido. El administrador está al tanto.
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Claim Modal */}
      {claimModalOrder && (
        <div className="modal-overlay" onClick={() => setClaimModalOrder(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#e74c3c' }}>
              <AlertTriangle /> Iniciar Reclamo
            </h3>
            <p style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>
              Pedido #{claimModalOrder.orderNumber || claimModalOrder.id?.substring(0, 8).toUpperCase()}<br/>
              Por favor, detalla el problema con tu pedido de manera protocolar. Nuestro equipo o el sistema automatizado lo revisará a la brevedad.
            </p>
            <textarea
              value={claimReason}
              onChange={(e) => setClaimReason(e.target.value)}
              placeholder="Ej: Faltó un artículo en el paquete, el talle no corresponde, etc."
              rows={4}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white', marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="neon-btn small-btn" style={{ background: 'transparent' }} onClick={() => setClaimModalOrder(null)}>Cancelar</button>
              <button className="neon-btn small-btn" style={{ background: '#e74c3c', color: 'white', border: 'none' }} onClick={handleSubmitClaim}>
                Enviar Reclamo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrdersView;
