import React, { useState } from 'react';
import { useFinances, type FinanceTransaction } from '../../hooks/useFinances';
import { useSales } from '../../hooks/useSales';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import './Admin.css';

const AdminFinancesView: React.FC = () => {
  const { transactions, loading: finLoading, addTransaction, removeTransaction } = useFinances();
  const { sales, loading: salesLoading } = useSales();

  const [formData, setFormData] = useState({
    type: 'expense' as FinanceTransaction['type'],
    amount: '',
    description: '',
    category: 'insumos'
  });

  const loading = finLoading || salesLoading;

  if (loading) return <div>Cargando módulo financiero...</div>;

  // Calculos Financieros
  const totalSalesRevenue = sales.reduce((acc, sale) => acc + sale.priceSold, 0);
  const totalSalesCost = sales.reduce((acc, sale) => acc + sale.totalCost, 0);
  const totalSalesProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);

  const totalOtherIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalInvestments = transactions.filter(t => t.type === 'investment').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const globalBalance = (totalSalesProfit + totalOtherIncome + totalInvestments) - totalExpenses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    try {
      await addTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category
      });
      setFormData({ type: 'expense', amount: '', description: '', category: 'insumos' });
      alert("Transacción registrada correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al registrar transacción.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Control Financiero Integral</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <DollarSign size={32} color="var(--krypton-green)" style={{ marginBottom: '10px' }} />
          <h3>Balance Global</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: globalBalance >= 0 ? 'var(--krypton-green)' : '#ff4444' }}>
            ${globalBalance.toFixed(2)}
          </p>
        </div>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <TrendingUp size={32} color="#3498db" style={{ marginBottom: '10px' }} />
          <h3>Ganancia Ventas</h3>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>${totalSalesProfit.toFixed(2)}</p>
          <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>(Ingreso: ${totalSalesRevenue.toFixed(2)} - Costo Insumos: ${totalSalesCost.toFixed(2)})</span>
        </div>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <TrendingDown size={32} color="#ff4444" style={{ marginBottom: '10px' }} />
          <h3>Total Egresos</h3>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>${totalExpenses.toFixed(2)}</p>
          <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>Operativos, Servicios, etc.</span>
        </div>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <TrendingUp size={32} color="#9b59b6" style={{ marginBottom: '10px' }} />
          <h3>Capital Invertido</h3>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>${totalInvestments.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* Formulario Nueva Transaccion */}
        <div className="admin-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Plus size={20} /> Nuevo Registro
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Tipo de Registro</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} required>
                <option value="expense">Egreso (Gasto)</option>
                <option value="income">Ingreso Extraordinario</option>
                <option value="investment">Inversión de Capital</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Categoría</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                <option value="insumos">Insumos/Stock Extra</option>
                <option value="servicios">Servicios Generales</option>
                <option value="marketing">Publicidad/Marketing</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Monto ($)</label>
              <input type="number" step="0.01" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="admin-form-group">
              <label>Descripción</label>
              <input type="text" placeholder="Ej: Compra de cajas" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <button type="submit" className="admin-btn" style={{ width: '100%', marginTop: '10px' }}>Registrar Movimiento</button>
          </form>
        </div>

        {/* Historial Transacciones */}
        <div className="admin-card">
          <h3 style={{ marginBottom: '20px' }}>Historial de Movimientos (Excluyendo Ventas)</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em',
                      background: t.type === 'expense' ? 'rgba(255, 68, 68, 0.2)' : t.type === 'investment' ? 'rgba(155, 89, 182, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                      color: t.type === 'expense' ? '#ff4444' : t.type === 'investment' ? '#9b59b6' : 'var(--krypton-green)'
                    }}>
                      {t.type === 'expense' ? 'Egreso' : t.type === 'investment' ? 'Inversión' : 'Ingreso'}
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{t.category}</td>
                  <td>{t.description}</td>
                  <td style={{ fontWeight: 'bold' }}>
                    {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => { if(window.confirm('¿Eliminar este registro?')) removeTransaction(t.id!) }} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay registros financieros manuales.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminFinancesView;
