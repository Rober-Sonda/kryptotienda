import React, { useState } from 'react';
import { useTrustedCompanies, type TrustedCompany } from '../../hooks/useTrustedCompanies';
import { useSettings } from '../../hooks/useSettings';
import { Shield, Target, Zap, Anchor, Hexagon, Triangle, Circle, Square, Command, Activity, Compass, Cpu, Globe, Rocket, Aperture, Plus, Trash2, Edit2, Upload, ImageIcon } from 'lucide-react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Admin.css';

// Legacy hardcoded companies for migration
const legacyCompanies = [
  { iconName: 'Shield', name: 'SecurityCorp' },
  { iconName: 'Activity', name: 'CrossFit Alpha' },
  { iconName: 'Zap', name: 'EnergyDrink Pro' },
  { iconName: 'Target', name: 'Bullseye Gym' },
  { iconName: 'Cpu', name: 'Tech Hardware Inc.' },
  { iconName: 'Anchor', name: 'Puerto Fitness' },
  { iconName: 'Hexagon', name: 'Hexa Games' },
  { iconName: 'Rocket', name: 'Startup Boost' },
  { iconName: 'Globe', name: 'Global Imports' },
  { iconName: 'Compass', name: 'Rutas Enduro' },
  { iconName: 'Aperture', name: 'Studio Focus' },
  { iconName: 'Command', name: 'Cmd Esports' },
  { iconName: 'Triangle', name: 'Pyramid Events' },
  { iconName: 'Circle', name: 'O-Ring Auto' },
  { iconName: 'Square', name: 'Block CrossFit' }
];

const ICONS_MAP: Record<string, any> = { Shield, Target, Zap, Anchor, Hexagon, Triangle, Circle, Square, Command, Activity, Compass, Cpu, Globe, Rocket, Aperture };

const AdminCompaniesView: React.FC = () => {
  const { companies, loading, addCompany, updateCompany, removeCompany } = useTrustedCompanies();
  const { settings, updateSettings } = useSettings();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  
  const [formData, setFormData] = useState<Partial<TrustedCompany>>({
    name: '',
    logoUrl: '',
    iconName: '',
    isActive: true,
    order: 0
  });

  if (loading) return <div>Cargando empresas...</div>;

  const handleMigrate = async () => {
    if (window.confirm("¿Importar las empresas de prueba al sistema dinámico?")) {
      for (let i = 0; i < legacyCompanies.length; i++) {
        await addCompany({
          name: legacyCompanies[i].name,
          iconName: legacyCompanies[i].iconName,
          logoUrl: '',
          isActive: true,
          order: i
        });
      }
      alert("Empresas importadas correctamente.");
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ name: '', logoUrl: '', iconName: '', isActive: true, order: companies.length });
    setIsModalOpen(true);
  };

  const openEditModal = (c: TrustedCompany) => {
    setEditingId(c.id || null);
    setFormData(c);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImg(true);
    try {
      const storageRef = ref(storage, `companies/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData({ ...formData, logoUrl: downloadURL, iconName: '' }); // Clear icon if logo is uploaded
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Error al subir el logo");
    }
    setUploadingImg(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingId) {
        await updateCompany(editingId, formData);
      } else {
        await addCompany(formData as Omit<TrustedCompany, 'id'>);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Error al guardar la empresa");
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('¿Eliminar esta empresa?')) {
      await removeCompany(id);
    }
  };

  const toggleCarousel = async () => {
    await updateSettings({ showTrustedCompanies: !settings?.showTrustedCompanies });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gestión de Empresas (Partners)</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {companies.length === 0 && (
            <button className="admin-btn" style={{ background: 'var(--krypton-green)', border: 'none', color: '#000', fontWeight: 'bold' }} onClick={handleMigrate}>
              Migrar Empresas de Prueba
            </button>
          )}
          <button className="admin-btn" onClick={openNewModal}>
            <Plus size={18} /> Agregar Empresa
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3>Visibilidad del Carrusel</h3>
          <p style={{ color: 'var(--text-muted)' }}>Muestra u oculta la sección completa en la página de inicio.</p>
        </div>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={settings?.showTrustedCompanies !== false} 
            onChange={toggleCarousel}
          />
          <span className="slider round"></span>
        </label>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Logo / Ícono</th>
              <th>Nombre de Empresa</th>
              <th>Orden</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => {
              const Icon = c.iconName && ICONS_MAP[c.iconName] ? ICONS_MAP[c.iconName] : null;
              
              return (
                <tr key={c.id} style={{ opacity: c.isActive ? 1 : 0.5 }}>
                  <td>
                    {c.logoUrl ? (
                      <img src={c.logoUrl} alt={c.name} style={{ height: '40px', objectFit: 'contain' }} />
                    ) : Icon ? (
                      <Icon size={32} color="var(--krypton-green)" />
                    ) : (
                      <ImageIcon size={32} color="var(--text-muted)" />
                    )}
                  </td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.order}</td>
                  <td>
                    <span style={{ color: c.isActive ? 'var(--krypton-green)' : '#ff4444' }}>
                      {c.isActive ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => openEditModal(c)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '10px' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(c.id!)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {companies.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                  No hay empresas cargadas. Usa el botón "Migrar" para importar las actuales o agrega una nueva.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Editar Empresa' : 'Nueva Empresa'}</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="admin-form-group">
                <label>Nombre de la Empresa *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div className="admin-form-group">
                <label>Logotipo (Recomendado PNG transparente)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {formData.logoUrl && (
                    <div style={{ background: '#fff', padding: '5px', borderRadius: '4px' }}>
                      <img src={formData.logoUrl} alt="Preview" style={{ height: '40px', objectFit: 'contain' }} />
                    </div>
                  )}
                  <label style={{ display: 'inline-block', padding: '10px', backgroundColor: 'var(--bg-dark)', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-color)', flex: 1, textAlign: 'center' }}>
                    <Upload size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    {uploadingImg ? 'Subiendo...' : 'Subir Logo PNG'}
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} disabled={uploadingImg} />
                  </label>
                </div>
              </div>

              {!formData.logoUrl && formData.iconName && (
                <div className="admin-form-group">
                  <label>Ícono Legacy</label>
                  <input type="text" value={formData.iconName} disabled style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>Al subir un logo, se reemplazará este ícono.</span>
                </div>
              )}

              <div className="admin-form-group" style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                  Visible en carrusel
                </label>
              </div>

              <div className="admin-form-group">
                <label>Orden</label>
                <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'white', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn" disabled={uploadingImg}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompaniesView;
