import React, { useState } from 'react';
import { useCategories, type Category } from '../../hooks/useCategories';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import './Admin.css';

const AdminCategoriesView: React.FC = () => {
  const { categories, loading, addCategory, updateCategory, removeCategory } = useCategories();
  const [isEditing, setIsEditing] = useState(false);
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

  const resetForm = () => {
    setIsEditing(false);
    setCurrentCategory({ name: '', slug: '', shortName: '', showOnHome: false, homeOrder: 0, subcategories: [] });
    setNewSubcat('');
  };

  const handleEdit = (cat: Category) => {
    setCurrentCategory(cat);
    setIsEditing(true);
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
      <div className="admin-header">
        <h2>Gestión de Categorías</h2>
        <button className="neon-btn small-btn" onClick={() => { resetForm(); setIsEditing(true); }}>
          <Plus size={18} /> Nueva Categoría
        </button>
      </div>

      {isEditing && (
        <div className="admin-form-container glass-panel">
          <h3>{currentCategory.id ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
          <form onSubmit={handleSave} className="admin-form">
            
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input 
                  type="text" required
                  value={currentCategory.name || ''} 
                  onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
                  placeholder="Ej. Anime Clásico & Actual"
                />
              </div>
              <div className="form-group">
                <label>Slug (Identificador único)</label>
                <input 
                  type="text" required
                  value={currentCategory.slug || ''} 
                  onChange={e => setCurrentCategory({...currentCategory, slug: e.target.value})}
                  placeholder="Ej. anime"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre Corto (Botones)</label>
                <input 
                  type="text" 
                  value={currentCategory.shortName || ''} 
                  onChange={e => setCurrentCategory({...currentCategory, shortName: e.target.value})}
                  placeholder="Ej. Anime"
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '25px' }}>
                  <input 
                    type="checkbox" 
                    checked={currentCategory.showOnHome || false}
                    onChange={e => setCurrentCategory({...currentCategory, showOnHome: e.target.checked})}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <strong>Mostrar como Sección en Inicio</strong>
                </label>
              </div>
            </div>

            {currentCategory.showOnHome && (
              <div className="form-group" style={{ maxWidth: '200px' }}>
                <label>Orden en el Inicio (1 = arriba)</label>
                <input 
                  type="number" 
                  value={currentCategory.homeOrder || 0} 
                  onChange={e => setCurrentCategory({...currentCategory, homeOrder: parseInt(e.target.value)})}
                />
              </div>
            )}

            <div className="form-group">
              <label>Subcategorías</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="text" 
                  value={newSubcat}
                  onChange={e => setNewSubcat(e.target.value)}
                  placeholder="Nueva subcategoría"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubcategory(); } }}
                />
                <button type="button" className="neon-btn small-btn" onClick={addSubcategory}>Añadir</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(currentCategory.subcategories || []).map(sub => (
                  <span key={sub} style={{ background: 'rgba(57,255,20,0.2)', padding: '5px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {sub}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSubcategory(sub)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancelar</button>
              <button type="submit" className="neon-btn">Guardar Categoría</button>
            </div>
          </form>
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
