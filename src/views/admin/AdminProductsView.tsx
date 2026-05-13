import React, { useState } from 'react';
import { useProducts, type Product } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminProductsView: React.FC = () => {
  const { products, loading: productsLoading, addProduct, updateProduct, removeProduct } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const loading = productsLoading || categoriesLoading;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: '',
    offerPrice: '',
    category: 'anime',
    subcategory: '',
    mockupBg: 'black',
    isActive: true,
    isMadeToOrder: false,
    isFeatured: false,
    image: ''
  });

  if (loading) return <div>Cargando productos...</div>;

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      title: '', price: '', offerPrice: '', category: categories.length > 0 ? categories[0].slug : '', subcategory: '',
      mockupBg: 'black', isActive: true, isMadeToOrder: false, isFeatured: false, image: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id || null);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImg(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData({ ...formData, image: downloadURL });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    }
    setUploadingImg(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.image) {
      alert("Por favor completa el título, precio y sube una imagen.");
      return;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await addProduct(formData as Omit<Product, 'id'>);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      await removeProduct(id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Catálogo de Productos</h2>
        <button className="admin-btn" onClick={openNewModal}>
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Precio Regular</th>
              <th>Oferta</th>
              <th>Estado</th>
              <th>Por Pedido</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ opacity: p.isActive === false ? 0.5 : 1 }}>
                <td>
                  {p.image ? <img src={p.image} alt={p.title} /> : <ImageIcon size={24} />}
                </td>
                <td>{p.title}</td>
                <td>{p.category} {p.subcategory && `- ${p.subcategory}`}</td>
                <td>{p.price}</td>
                <td>{p.offerPrice || '-'}</td>
                <td>
                  <span style={{ color: p.isActive !== false ? 'var(--krypton-green)' : '#ff4444' }}>
                    {p.isActive !== false ? 'Activo' : 'Descontinuado'}
                  </span>
                </td>
                <td>{p.isMadeToOrder ? 'Sí' : 'No'}</td>
                <td>{p.isFeatured ? '🌟 Sí' : 'No'}</td>
                <td>
                  <button onClick={() => openEditModal(p)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginRight: '10px' }}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => p.id && handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>No hay productos. Usa la opción Migración si acabas de instalar el panel.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Título del Producto *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                
                <div className="admin-form-group">
                  <label>Precio Regular *</label>
                  <input type="text" name="price" value={formData.price} onChange={handleChange} required placeholder="Ej: $25.000" />
                </div>

                <div className="admin-form-group">
                  <label>Precio de Oferta (Opcional)</label>
                  <input type="text" name="offerPrice" value={formData.offerPrice || ''} onChange={handleChange} placeholder="Ej: $20.000" />
                </div>

                <div className="admin-form-group">
                  <label>Categoría *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="" disabled>Selecciona una categoría</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Subcategoría (Opcional)</label>
                  <select name="subcategory" value={formData.subcategory || ''} onChange={handleChange}>
                    <option value="">Ninguna</option>
                    {categories.find(c => c.slug === formData.category)?.subcategories?.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Imagen del Producto *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formData.image && <img src={formData.image} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />}
                    <label style={{ display: 'inline-block', padding: '10px', backgroundColor: 'var(--bg-dark)', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
                      <Upload size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                      {uploadingImg ? 'Subiendo...' : 'Subir Imagen'}
                      <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} disabled={uploadingImg} />
                    </label>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Fondo de Mockup</label>
                  <select name="mockupBg" value={formData.mockupBg} onChange={handleChange}>
                    <option value="black">Negro</option>
                    <option value="white">Blanco</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="isActive" checked={formData.isActive !== false} onChange={handleChange} />
                    Activo (Visible en tienda)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="isMadeToOrder" checked={formData.isMadeToOrder || false} onChange={handleChange} />
                    Es por pedido / Exclusivo
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured || false} onChange={handleChange} />
                    🌟 Mostrar en Portada (Destacado)
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsView;
