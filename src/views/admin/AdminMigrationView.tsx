import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { productsData } from '../../data/products';
import { Database } from 'lucide-react';

const AdminMigrationView: React.FC = () => {
  const { addProduct } = useProducts();
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleMigrate = async () => {
    if (!window.confirm('¿Estás seguro de que quieres migrar los datos locales a Firestore? Esto creará copias si ya los habías migrado antes.')) return;
    
    setMigrating(true);
    setProgress(0);
    
    try {
      for (let i = 0; i < productsData.length; i++) {
        const prod = productsData[i];
        await addProduct({
          title: prod.title,
          image: prod.image,
          price: prod.price,
          category: prod.category,
          subcategory: prod.subcategory,
          mockupBg: prod.mockupBg,
          isActive: true,
          isMadeToOrder: false
        });
        setProgress(Math.round(((i + 1) / productsData.length) * 100));
      }
      alert('Migración completada con éxito.');
    } catch (error) {
      console.error(error);
      alert('Error durante la migración.');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Migración de Datos</h2>
      <div className="admin-card">
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
          Usa esta herramienta para copiar todos los productos que están actualmente en el archivo local de tu proyecto hacia la base de datos en Firestore. Solo deberías hacer esto una vez para no duplicar tu catálogo.
        </p>
        
        <button className="admin-btn" onClick={handleMigrate} disabled={migrating}>
          <Database size={18} />
          {migrating ? `Migrando... ${progress}%` : 'Migrar Catálogo Actual'}
        </button>
      </div>
    </div>
  );
};

export default AdminMigrationView;
