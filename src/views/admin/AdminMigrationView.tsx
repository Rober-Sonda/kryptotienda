import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { productsData } from '../../data/products';
import { useFacilities } from '../../hooks/useFacilities';
import { initialFacilitiesData } from '../../data/facilities';
import { Database } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AdminMigrationView: React.FC = () => {
  const { addProduct } = useProducts();
  const { addFacility } = useFacilities();
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [migratingFac, setMigratingFac] = useState(false);
  const [facProgress, setFacProgress] = useState(0);
  const [isMigrating, setIsMigrating] = useState(false);

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

  const migrateCategories = async () => {
    setIsMigrating(true);
    try {
      const initialCategories = [
        { name: 'La Escaloneta ⭐⭐⭐', slug: 'argentina', shortName: 'Argentina', subcategories: ['Messi', 'Scaloneta ⭐⭐⭐', 'Orgullo Nacional', 'Maradona'], showOnHome: true, homeOrder: 1 },
        { name: 'Anime Clásico & Actual', slug: 'anime', shortName: 'Anime', subcategories: ['Shonen', 'Clásicos', 'Modernos'], showOnHome: true, homeOrder: 2 },
        { name: 'Videojuegos Clásicos', slug: 'retro', shortName: 'Retro', subcategories: ['Aventura', 'Nostalgia', 'Arcade'], showOnHome: true, homeOrder: 3 },
        { name: 'Anime Gym & Fitness', slug: 'gym', shortName: 'Gym', subcategories: ['Anime Fitness', 'OTROS'], showOnHome: true, homeOrder: 4 },
        { name: 'Los Simpsons & Clásicos 90s', slug: 'simpsons', shortName: 'Los Simpsons', subcategories: ['Amarillos', 'TV Clásica'], showOnHome: true, homeOrder: 5 }
      ];

      for (const cat of initialCategories) {
        await addDoc(collection(db, 'categories'), cat);
      }
      
      alert('¡Categorías iniciales migradas exitosamente a la base de datos!');
    } catch (error) {
      console.error(error);
      alert('Error al migrar las categorías.');
    }
    setIsMigrating(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Migración de Datos</h2>
      <div className="admin-card">
        <h3>Migrar Datos Iniciales</h3>
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
          Esta herramienta copiará los datos estáticos locales (códigos fuente) a la base de datos de Firestore. 
          <strong> Úsala solo una vez</strong> para inicializar tu panel de control, de lo contrario duplicarás los registros.
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button className="neon-btn small-btn" onClick={migrateCategories} disabled={isMigrating}>
            <Database size={18} />
            {isMigrating ? 'Migrando Categorías...' : '1. Inyectar Categorías'}
          </button>
          
          <button className="neon-btn small-btn" onClick={handleMigrate} disabled={migrating}>
            <Database size={18} />
            {migrating ? `Migrando Productos... ${progress}%` : '2. Migrar Productos'}
          </button>

          <button className="neon-btn small-btn" onClick={handleMigrateFacilities} disabled={migratingFac}>
            <Database size={18} />
            {migratingFac ? `Migrando Instalaciones... ${facProgress}%` : '3. Migrar Instalaciones'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMigrationView;
