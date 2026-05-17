import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders, useOrderWhatsApp, type Order } from '../hooks/useOrders';
import { Package, MessageCircle, Edit3, CheckCircle, XCircle } from 'lucide-react';
import './Store.css';

const STATUS_MAP: Record<string, { label: string, color: string }> = {
  pending: { label: 'Pendiente', color: '#f39c12' },
  processing: { label: 'En Proceso', color: '#3498db' },
  shipped: { label: 'Enviado', color: '#9b59b6' },
  delivered: { label: 'Entregado', color: '#2ecc71' },
  cancelled: { label: 'Cancelado', color: '#e74c3c' }
};

const MyOrdersView: React.FC = () => {
  const { currentUser } = useAuth();
  const { orders, loading, editOrderItems } = useOrders(currentUser?.uid);
  const { generateMessage } = useOrderWhatsApp();

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editedItems, setEditedItems] = useState<any[]>([]);

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
                  <h3 style={{ margin: '0 0 5px 0' }}>Pedido #{order.id?.substring(0, 8).toUpperCase()}</h3>
                  <span style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
    </div>
  );
};

export default MyOrdersView;
