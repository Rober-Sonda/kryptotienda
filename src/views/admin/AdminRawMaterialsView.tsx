import React, { useState } from 'react';
import { useRawMaterials, type RawMaterial } from '../../hooks/useRawMaterials';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

const CATEGORIES = ['Bolsa', 'Cinta', 'Tinta', 'Papel', 'Caja', 'Etiqueta', 'Otro'];

const AdminRawMaterialsView: React.FC = () => {
  const { rawMaterials, loading, addRawMaterial, updateRawMaterial, removeRawMaterial } = useRawMaterials();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<RawMaterial>>({
    name: '',
    category: 'Bolsa',
    cost: 0,
    stock: 0,
    minStock: 0
  });

  if (loading) return <div>Cargando materias primas...</div>;

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Bolsa', cost: 0, stock: 0, minStock: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (material: RawMaterial) => {
    setEditingId(material.id || null);
    setFormData(material);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      alert("Por favor completa el nombre y la categoría.");
      return;
    }

    try {
      if (editingId) {
        await updateRawMaterial(editingId, formData);
      } else {
        await addRawMaterial(formData as Omit<RawMaterial, 'id'>);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la materia prima");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar este material? Esta acción no se puede deshacer.')) {
      await removeRawMaterial(id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Inventario de Materias Primas / Insumos</h2>
        <button className="admin-btn" onClick={openNewModal}>
          <Plus size={18} /> Nuevo Insumo
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Categoría</th>
              <th>Costo Unitario</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rawMaterials.map(m => {
              const isLowStock = m.stock <= m.minStock;
              return (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={16} />
                      {m.name}
                    </div>
                  </td>
                  <td>{m.category}</td>
                  <td>${m.cost.toFixed(2)}</td>
                  <td>
                    <span style={{ fontWeight: 'bold', color: isLowStock ? '#ff4444' : 'inherit' }}>
                      {m.stock}
                    </span>
                  </td>
                  <td>{m.minStock}</td>
                  <td>
                    {isLowStock ? (
                      <span style={{ color: '#ff4444', fontSize: '0.9em', fontWeight: 'bold' }}>⚠️ Stock Bajo</span>
                    ) : (
                      <span style={{ color: 'var(--krypton-green)', fontSize: '0.9em' }}>Ok</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => openEditModal(m)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginRight: '10px' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => m.id && handleDelete(m.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {rawMaterials.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No hay insumos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Editar Insumo' : 'Nuevo Insumo'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="admin-form-group">
                  <label>Nombre del Insumo *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Bolsa Papel Kraft Pequeña" />
                </div>
                
                <div className="admin-form-group">
                  <label>Categoría *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Costo Unitario ($) *</label>
                  <input type="number" name="cost" value={formData.cost} onChange={handleChange} required min="0" step="0.01" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="admin-form-group">
                    <label>Stock Actual *</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" step="0.01" />
                  </div>
                  <div className="admin-form-group">
                    <label>Stock Mínimo (Alerta) *</label>
                    <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} required min="0" step="0.01" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn">Guardar Insumo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRawMaterialsView;
