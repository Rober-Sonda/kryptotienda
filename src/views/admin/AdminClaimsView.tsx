import React, { useState } from 'react';
import { useClaims, type ClaimStatus } from '../../hooks/useClaims';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import './Admin.css';

const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  open: { label: 'Abierto', color: '#e74c3c', icon: AlertTriangle },
  in_progress: { label: 'En Revisión', color: '#f39c12', icon: Clock },
  resolved: { label: 'Resuelto', color: '#2ecc71', icon: CheckCircle },
  rejected: { label: 'Rechazado', color: '#7f8c8d', icon: XCircle }
};

const AdminClaimsView: React.FC = () => {
  const { claims, loading, updateClaimStatus } = useClaims();
  const [activeTab, setActiveTab] = useState<ClaimStatus | 'all'>('open');
  const [resolutionNote, setResolutionNote] = useState<Record<string, string>>({});

  if (loading) return <div>Cargando reclamos...</div>;

  const filteredClaims = claims.filter(c => activeTab === 'all' || c.status === activeTab);

  const handleStatusChange = async (claimId: string, newStatus: ClaimStatus) => {
    try {
      const note = resolutionNote[claimId] || '';
      await updateClaimStatus(claimId, newStatus, note);
      alert("Estado del reclamo actualizado.");
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el reclamo.");
    }
  };

  const handleNoteChange = (claimId: string, note: string) => {
    setResolutionNote(prev => ({ ...prev, [claimId]: note }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Centro de Reclamos</h2>
      </div>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab('all')} className={`admin-tab-btn ${activeTab === 'all' ? 'active' : ''}`}>
          Todos
        </button>
        {Object.entries(STATUS_MAP).map(([status, data]) => {
          const Icon = data.icon;
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status as ClaimStatus)}
              className={`admin-tab-btn ${activeTab === status ? 'active' : ''}`}
            >
              <Icon size={16} /> {data.label}
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
              <th>Motivo / Reclamo</th>
              <th>Gestión / Notas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map(claim => (
              <tr key={claim.id} style={{ backgroundColor: claim.status === 'open' ? 'rgba(231, 76, 60, 0.1)' : 'transparent' }}>
                <td><strong>{claim.orderNumber}</strong></td>
                <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                <td>{claim.customerName}</td>
                <td style={{ maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {claim.reason}
                </td>
                <td style={{ maxWidth: '250px' }}>
                  <textarea 
                    placeholder="Notas internas de resolución..."
                    value={resolutionNote[claim.id!] !== undefined ? resolutionNote[claim.id!] : (claim.resolutionNotes || '')}
                    onChange={(e) => handleNoteChange(claim.id!, e.target.value)}
                    style={{ width: '100%', minHeight: '60px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '5px' }}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select 
                      value={claim.status} 
                      onChange={(e) => handleStatusChange(claim.id!, e.target.value as ClaimStatus)}
                      style={{ padding: '5px', borderRadius: '4px', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)' }}
                    >
                      <option value="open">Abierto</option>
                      <option value="in_progress">En Revisión</option>
                      <option value="resolved">Resuelto</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                    {resolutionNote[claim.id!] !== undefined && resolutionNote[claim.id!] !== claim.resolutionNotes && (
                      <button onClick={() => handleStatusChange(claim.id!, claim.status)} className="neon-btn small-btn" style={{ fontSize: '0.8em', padding: '4px' }}>
                        Guardar Nota
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredClaims.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay reclamos en esta categoría.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClaimsView;
