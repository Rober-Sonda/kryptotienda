import React, { useState } from 'react';
import { useCategories, type Category } from '../../hooks/useCategories';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import './Admin.css';

const AdminCategoriesView: React.FC = () => {
  const { categories, loading, addCategory, updateCategory, removeCategory } = useCategories();
  const { categories, loading, addCategory, updateCategory, removeCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({
    name: '', slug: '', shortName: '', showOnHome: false, homeOrder: 0, subcategories: []
  });
  const [newSubcat, setNewSubcat] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const catData = {
        name: currentCategory.name || '',
        slug: currentCategory.slug || currentCategory.name?.toLowerCase().replace(/\s+/g, '-') || '',
        shortName: currentCategory.shortName || '',
        showOnHome: currentCategory.showOnHome || false,
        homeOrder: currentCategory.homeOrder || 0,
        subcategories: currentCategory.subcategories || []
      };

      if (currentCategory.id) {
        await updateCategory(currentCategory.id, catData);
      } else {
        await addCategory(catData);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error al guardar la categoría.");
    }
  };

  const openNewModal = () => {
    setCurrentCategory({ name: '', slug: '', shortName: '', showOnHome: false, homeOrder: 0, subcategories: [] });
    setNewSubcat('');
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setCurrentCategory({ name: '', slug: '', shortName: '', showOnHome: false, homeOrder: 0, subcategories: [] });
    setNewSubcat('');
  };

  const handleEdit = (cat: Category) => {
    setCurrentCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría? Asegúrate de que no haya productos usándola.')) {
      await removeCategory(id);
    }
  };

  const addSubcategory = () => {
    if (newSubcat.trim() && !currentCategory.subcategories?.includes(newSubcat.trim())) {
      setCurrentCategory(prev => ({
        ...prev,
        subcategories: [...(prev.subcategories || []), newSubcat.trim()]
      }));
      setNewSubcat('');
    }
  };

  const removeSubcategory = (sub: string) => {
    setCurrentCategory(prev => ({
      ...prev,
      subcategories: (prev.subcategories || []).filter(s => s !== sub)
    }));
  };

  return (
    <div className="admin-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gestión de Categorías</h2>
        <button className="admin-btn" onClick={openNewModal}>
          <Plus size={18} /> Nueva Categoría
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Cargando categorías...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Slug</th>
                <th>En Inicio</th>
                <th>Subcategorías</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <strong>{cat.name}</strong>
                    {cat.shortName && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Corto: {cat.shortName}</span>}
                  </td>
                  <td>{cat.slug}</td>
                  <td>{cat.showOnHome ? `Sí (Orden: ${cat.homeOrder})` : 'No'}</td>
                  <td>{cat.subcategories.join(', ') || '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(cat)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginRight: '10px' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(cat.id!)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No hay categorías creadas.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>{currentCategory.id ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                
                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Nombre Completo *</label>
                  <input 
                    type="text" required
                    value={currentCategory.name || ''} 
                    onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
                    placeholder="Ej. Anime Clásico & Actual"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Identificador Único (Slug) *</label>
                  <input 
                    type="text" required
                    value={currentCategory.slug || ''} 
                    onChange={e => setCurrentCategory({...currentCategory, slug: e.target.value})}
                    placeholder="Ej. anime"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Nombre Corto (Para botones)</label>
                  <input 
                    type="text" 
                    value={currentCategory.shortName || ''} 
                    onChange={e => setCurrentCategory({...currentCategory, shortName: e.target.value})}
                    placeholder="Ej. Anime"
                  />
                </div>

                <div className="admin-form-group" style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={currentCategory.showOnHome || false}
                      onChange={e => setCurrentCategory({...currentCategory, showOnHome: e.target.checked})}
                    />
                    <strong>Mostrar como Sección en Inicio</strong>
                  </label>

                  {currentCategory.showOnHome && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label style={{ margin: 0 }}>Orden:</label>
                      <input 
                        type="number" 
                        value={currentCategory.homeOrder || 0} 
                        onChange={e => setCurrentCategory({...currentCategory, homeOrder: parseInt(e.target.value)})}
                        style={{ width: '80px', padding: '5px' }}
                      />
                    </div>
                  )}
                </div>

                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Subcategorías</label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input 
                      type="text" 
                      value={newSubcat}
                      onChange={e => setNewSubcat(e.target.value)}
                      placeholder="Escribe y presiona Añadir"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubcategory(); } }}
                    />
                    <button type="button" className="admin-btn" onClick={addSubcategory}>Añadir</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '30px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    {(currentCategory.subcategories || []).length === 0 && (
                      <span style={{ color: 'var(--text-muted)' }}>No hay subcategorías.</span>
                    )}
                    {(currentCategory.subcategories || []).map(sub => (
                      <span key={sub} style={{ background: 'var(--krypton-green)', color: 'black', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        {sub}
                        <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSubcategory(sub)} />
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={resetForm} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'white', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn">Guardar Categoría</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-container glass-panel">
        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Slug</th>
                <th>En Inicio</th>
                <th>Subcategorías</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <strong>{cat.name}</strong>
                    {cat.shortName && <span style={{ fontSize: '0.8rem', color: 'gray', display: 'block' }}>Corto: {cat.shortName}</span>}
                  </td>
                  <td>{cat.slug}</td>
                  <td>{cat.showOnHome ? `Sí (Orden: ${cat.homeOrder})` : 'No'}</td>
                  <td>{cat.subcategories.join(', ')}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(cat)} className="icon-btn edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(cat.id!)} className="icon-btn delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesView;
