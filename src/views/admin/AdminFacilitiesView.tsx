import React, { useState } from 'react';
import { useFacilities, type Facility } from '../../hooks/useFacilities';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Admin.css';

const SIZES = [
  { value: 'small', label: 'Pequeña (1 columna)' },
  { value: 'medium', label: 'Mediana (2 columnas)' },
  { value: 'large', label: 'Grande (Ancho completo)' }
];

const AdminFacilitiesView: React.FC = () => {
  const { facilities, loading, addFacility, updateFacility, removeFacility } = useFacilities();
  const [isEditing, setIsEditing] = useState(false);
  const [currentFacility, setCurrentFacility] = useState<Partial<Facility>>({
    title: '', description: '', image: '', size: 'small', order: 0
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCurrentFacility(prev => ({ ...prev, image: '' })); // Limpiar URL si sube archivo
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    const storageRef = ref(storage, `facilities/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploadingImage(true);
      
      let imageUrl = currentFacility.image;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      if (!imageUrl) {
        alert("Debes proveer una URL de imagen o subir un archivo.");
        setUploadingImage(false);
        return;
      }

      const facilityData = {
        ...currentFacility,
        image: imageUrl,
      } as Omit<Facility, 'id'>;

      if (currentFacility.id) {
        await updateFacility(currentFacility.id, facilityData);
      } else {
        await addFacility(facilityData);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving facility:", error);
      alert("Error al guardar la instalación.");
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentFacility({ title: '', description: '', image: '', size: 'small', order: 0 });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (facility: Facility) => {
    setCurrentFacility(facility);
    setImagePreview(facility.image);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta instalación?')) {
      await removeFacility(id);
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-header">
        <h2>Gestión de Instalaciones</h2>
        <button className="neon-btn small-btn" onClick={() => { resetForm(); setIsEditing(true); }}>
          <Plus size={18} /> Nueva Instalación
        </button>
      </div>

      {isEditing && (
        <div className="admin-form-container glass-panel">
          <h3>{currentFacility.id ? 'Editar Instalación' : 'Nueva Instalación'}</h3>
          <form onSubmit={handleSave} className="admin-form">
            
            <div className="form-group">
              <label>Título</label>
              <input 
                type="text" 
                required
                value={currentFacility.title || ''} 
                onChange={e => setCurrentFacility({...currentFacility, title: e.target.value})}
                placeholder="Ej. Exhibiciones Épicas"
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea 
                required
                rows={3}
                value={currentFacility.description || ''} 
                onChange={e => setCurrentFacility({...currentFacility, description: e.target.value})}
                placeholder="Describe la instalación..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tamaño en la grilla</label>
                <select 
                  value={currentFacility.size || 'small'}
                  onChange={e => setCurrentFacility({...currentFacility, size: e.target.value as 'small'|'medium'|'large'})}
                >
                  {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Orden (numérico)</label>
                <input 
                  type="number" 
                  value={currentFacility.order || 0} 
                  onChange={e => setCurrentFacility({...currentFacility, order: parseInt(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Imagen</label>
              <div className="image-upload-container">
                <div className="image-preview" style={{ backgroundImage: `url(${imagePreview || currentFacility.image || ''})` }}>
                  {!imagePreview && !currentFacility.image && <ImageIcon size={40} opacity={0.5} />}
                </div>
                <div className="image-upload-controls">
                  <p className="text-muted" style={{fontSize: '0.85rem', marginBottom: '10px'}}>Sube una imagen desde tu equipo o pega una URL directa.</p>
                  <label className="upload-btn">
                    <Upload size={16} /> Subir desde PC
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
                  </label>
                  <span style={{margin: '0 10px'}}>O</span>
                  <input 
                    type="text" 
                    placeholder="URL de la imagen (ej. https://...)" 
                    value={currentFacility.image || ''}
                    onChange={e => {
                      setCurrentFacility({...currentFacility, image: e.target.value});
                      setImagePreview(e.target.value);
                      setImageFile(null);
                    }}
                    style={{flex: 1}}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm} disabled={uploadingImage}>
                Cancelar
              </button>
              <button type="submit" className="neon-btn" disabled={uploadingImage}>
                {uploadingImage ? 'Guardando...' : 'Guardar Instalación'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container glass-panel">
        {loading ? (
          <p>Cargando instalaciones...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título</th>
                <th>Tamaño</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map(facility => (
                <tr key={facility.id}>
                  <td>
                    <img src={facility.image} alt={facility.title} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}} />
                  </td>
                  <td>
                    <strong>{facility.title}</strong>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{facility.description.substring(0, 40)}...</div>
                  </td>
                  <td>{SIZES.find(s => s.value === facility.size)?.label || facility.size}</td>
                  <td>{facility.order || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(facility)} className="icon-btn edit" title="Editar"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(facility.id!)} className="icon-btn delete" title="Eliminar"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {facilities.length === 0 && (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>No hay instalaciones configuradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminFacilitiesView;
