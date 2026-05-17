import React, { useState } from 'react';
import { useOrders, type Order, type OrderStatus } from '../../hooks/useOrders';
import { Package, Clock, Truck, CheckCircle, XCircle, AlertTriangle, Plus } from 'lucide-react';
import './Admin.css';

const TABS: { id: OrderStatus | 'all', label: string, icon: any }[] = [
  { id: 'all', label: 'Todos', icon: Package },
  { id: 'pending', label: 'Pendientes', icon: Clock },
  { id: 'processing', label: 'En Proceso', icon: Package },
  { id: 'shipped', label: 'Enviados', icon: Truck },
  { id: 'delivered', label: 'Entregados', icon: CheckCircle },
  { id: 'cancelled', label: 'Cancelados', icon: XCircle }
];

const ITEMS_PER_PAGE = 10;

const AdminOrdersView: React.FC = () => {
  const { orders, loading, updateOrderStatus, clearEditedFlag } = useOrders();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('pending');
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <div>Cargando pedidos...</div>;

  const filteredOrders = orders.filter(o => activeTab === 'all' || o.status === activeTab);
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (e) {
      console.error(e);
      alert("Error al actualizar estado.");
    }
  };

  const handleClearWarning = async (orderId: string) => {
    try {
      await clearEditedFlag(orderId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gestión de Pedidos</h2>
        <button className="admin-btn">
          <Plus size={18} /> Carga Manual
        </button>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
              className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{ padding: '10px 15px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(order => (
              <tr key={order.id} style={{ backgroundColor: order.wasEdited ? 'rgba(243, 156, 18, 0.1)' : 'transparent' }}>
                <td>
                  {order.id?.substring(0, 8).toUpperCase()}
                  {order.wasEdited && (
                    <div style={{ color: '#f39c12', fontSize: '0.8em', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <AlertTriangle size={12} /> Editado por cliente
                    </div>
                  )}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <strong>{order.customerName}</strong><br/>
                  <span style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>{order.customerPhone}</span>
                </td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id!, e.target.value as OrderStatus)}
                    style={{ padding: '5px', borderRadius: '4px', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)' }}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">En Proceso</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ background: 'none', border: '1px solid var(--border-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                      Ver Detalles
                    </button>
                    {order.wasEdited && (
                      <button onClick={() => handleClearWarning(order.id!)} style={{ background: 'none', border: '1px solid #f39c12', color: '#f39c12', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                        Marcar Leído
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay pedidos en esta categoría.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            style={{ padding: '5px 15px', background: 'var(--bg-card)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Anterior
          </button>
          <span style={{ padding: '5px 15px' }}>Página {currentPage} de {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            style={{ padding: '5px 15px', background: 'var(--bg-card)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersView;
