import React, { useState, useEffect } from 'react';
import { useSettings, type FooterSettings } from '../../hooks/useSettings';
import { Save } from 'lucide-react';

const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState<FooterSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (loading || !formData) return <div>Cargando configuración...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      alert('Configuración guardada correctamente.');
    } catch (error) {
      console.error(error);
      alert('Error al guardar.');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Configuración General y Pie de Página</h2>
      
      <form onSubmit={handleSubmit} className="admin-card">
        <div className="admin-form-group">
          <label>
            <input 
              type="checkbox" 
              name="showContact" 
              checked={formData.showContact} 
              onChange={handleChange} 
            />
            Mostrar información de contacto en el Footer
          </label>
        </div>
        
        {formData.showContact && (
          <>
            <div className="admin-form-group">
              <label>Dirección</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label>Teléfono</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label>Email</label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label>Link de Google Maps</label>
              <input type="text" name="mapLink" value={formData.mapLink} onChange={handleChange} />
            </div>
          </>
        )}

        <div className="admin-form-group">
          <label>Eslogan / Frase</label>
          <input type="text" name="slogan" value={formData.slogan} onChange={handleChange} />
        </div>

        <div className="admin-form-group">
          <label>
            <input 
              type="checkbox" 
              name="showCategories" 
              checked={formData.showCategories} 
              onChange={handleChange} 
            />
            Mostrar links de categorías
          </label>
        </div>

        <div className="admin-form-group">
          <label>
            <input 
              type="checkbox" 
              name="showSocial" 
              checked={formData.showSocial} 
              onChange={handleChange} 
            />
            Mostrar iconos sociales
          </label>
        </div>

        <button type="submit" className="admin-btn" disabled={saving}>
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsView;
