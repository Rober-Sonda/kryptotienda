import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { productsData } from '../../data/products';
import { useFacilities } from '../../hooks/useFacilities';
import { initialFacilitiesData } from '../../data/facilities';
import { Database } from 'lucide-react';

const AdminMigrationView: React.FC = () => {
  const { addProduct } = useProducts();
  const { addFacility } = useFacilities();
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [migratingFac, setMigratingFac] = useState(false);
  const [facProgress, setFacProgress] = useState(0);

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

  const handleMigrateFacilities = async () => {
    if (!window.confirm('¿Migrar instalaciones estáticas a Firestore?')) return;
    setMigratingFac(true);
    setFacProgress(0);
    try {
      for (let i = 0; i < initialFacilitiesData.length; i++) {
        await addFacility(initialFacilitiesData[i]);
        setFacProgress(Math.round(((i + 1) / initialFacilitiesData.length) * 100));
      }
      alert('Instalaciones migradas con éxito.');
    } catch (error) {
      console.error(error);
      alert('Error migrando instalaciones.');
    } finally {
      setMigratingFac(false);
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
          {migrating ? `Migrando Productos... ${progress}%` : 'Migrar Catálogo Actual'}
        </button>

        <hr style={{ margin: '30px 0', borderColor: 'var(--krypton-green)', opacity: 0.2 }} />

        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
          Migrar tarjetas estáticas de "Nuestras Instalaciones".
        </p>
        
        <button className="admin-btn" onClick={handleMigrateFacilities} disabled={migratingFac}>
          <Database size={18} />
          {migratingFac ? `Migrando Instalaciones... ${facProgress}%` : 'Migrar Instalaciones'}
        </button>
      </div>
    </div>
  );
};

export default AdminMigrationView;
