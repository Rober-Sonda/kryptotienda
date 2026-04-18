import React, { useState, useRef } from 'react';
import { Upload, MessageCircle, LogIn, FileImage, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase.ts';
import './CustomDesigns.css';

const CustomDesigns: React.FC = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  
  const [productType, setProductType] = useState('Remera');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("El archivo no debe pesar más de 10 MB.");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !currentUser) return;

    setIsUploading(true);
    try {
      const fileExtension = file.name.split('.').pop() || 'png';
      const filePath = `custom_requests/${currentUser.uid}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const storageRef = ref(storage, filePath);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'custom_requests'), {
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName,
        productType,
        size,
        color,
        description,
        fileUrl: downloadURL,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      const message = `*NUEVO PEDIDO PERSONALIZADO*\n\nHola Krypton, soy ${currentUser.displayName}.\nLes envío mi diseño para cotizar en formato original.\n\n*Producto*: ${productType}\n*Talle*: ${size || 'N/A'}\n*Color*: ${color || 'N/A'}\n*Detalles*: ${description || 'N/A'}\n\n*🖼️ ARCHIVO ORIGINAL (ALTA CALIDAD)*:\n${downloadURL}\n\n¡Gracias!`;
      const whatsappUrl = `https://wa.me/5492317534545?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert("Lo sentimos. Ocurrió un fallo al subir el archivo, intenta nuevamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="custom" className="container custom-form-section">
      <div className="custom-form-wrapper glass-panel">
        <h2 className="form-title">Formulario de <span className="text-krypton">Cotización</span></h2>
        
        {!currentUser ? (
          <div className="login-prompt">
            <LogIn size={40} className="text-muted" style={{ marginBottom: '1rem' }} />
            <h3>Inicia Sesión para Cargar tu Diseño</h3>
            <p>Necesitas acceder con tu cuenta de Google para poder subir archivos de manera segura a nuestra nube.</p>
            <button className="neon-btn login-btn" onClick={loginWithGoogle}>
              <LogIn size={20} /> Iniciar Sesión con Google
            </button>
          </div>
        ) : (
          <form className="custom-request-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Tipo de Prenda/Producto</label>
                <select value={productType} onChange={(e) => setProductType(e.target.value)} required>
                  <option value="Remera">Remera Sublimada / DTF</option>
                  <option value="Buzo">Buzo</option>
                  <option value="Gorra">Gorra</option>
                  <option value="Taza">Taza</option>
                  <option value="Stickers">Stickers / Calcos</option>
                  <option value="Otro">Otro Producto</option>
                </select>
              </div>

              <div className="form-group">
                <label>Color Dominante o Específico</label>
                <input 
                  type="text" 
                  placeholder="Ej: Negro, Blanco, Verde Neón..." 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Talle (si aplica)</label>
                <input 
                  type="text" 
                  placeholder="Ej: L, M, XL o N/A" 
                  value={size} 
                  onChange={(e) => setSize(e.target.value)} 
                />
              </div>

              <div className="form-group full-width">
                <label>Ubicación y Notas Adicionales</label>
                <textarea 
                  placeholder="Quiero el logo en el pecho izquierdo y gigante en la espalda..." 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width upload-group">
                <label>Subir Diseño Original (Max 10MB)</label>
                <div 
                  className={`upload-dropzone ${file ? 'has-file' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, application/pdf" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange}
                  />
                  
                  {previewUrl ? (
                    <div className="file-preview-wrapper" onClick={(e) => e.stopPropagation()}>
                      {file?.type.includes('image') ? (
                        <img src={previewUrl} alt="Vista Previa" className="preview-thumbnail" />
                      ) : (
                        <FileImage size={40} className="text-krypton" />
                      )}
                      <div className="file-info">
                        <span className="file-name">{file?.name}</span>
                        <span className="file-size">{(file!.size / 1024 / 1024).toFixed(2)} MB</span>
                        <button type="button" className="text-btn remove-file" onClick={() => { setFile(null); setPreviewUrl(null); }}>Cambiar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={30} className="text-krypton" />
                      <p>Click para buscar tu archivo (PNG Transparente ideal)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions text-center">
              <button type="submit" className="neon-btn submit-btn" disabled={!file || isUploading}>
                {isUploading ? (
                  <><Loader2 size={20} className="spinner" /> Procesando Alta Calidad...</>
                ) : (
                  <><MessageCircle size={20} /> Enviar a WhatsApp y Guardar</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default CustomDesigns;
