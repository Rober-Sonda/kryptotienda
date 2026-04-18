import React from 'react';
import CustomDesigns from '../components/CustomDesigns.tsx';

const CustomDesignView: React.FC = () => {
  return (
    <div className="fade-in" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
      <div className="store-header" style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <span>Diseños </span>
          <span className="title-krypton">Personales</span>
        </h1>
        <p className="krypton-lore" style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '750px', lineHeight: '1.6', textAlign: 'center', margin: '0', padding: '0 1.5rem' }}>
          Para enviarnos tu diseño, te recomendamos seguir las siguientes instrucciones para garantizar la más alta calidad óptica en tus sublimados.
        </p>
      </div>
      
      <div className="container">

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
            <h3 className="text-krypton" style={{ marginBottom: '1rem' }}>1. Formato de Imagen</h3>
            <p>Aceptamos archivos en <strong>PNG (Altamente recomendado)</strong> o JPG. Si es PNG, preferentemente con fondo transparente para poder integrarlo naturalmente al color de la prenda.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
            <h3 className="text-krypton" style={{ marginBottom: '1rem' }}>2. Tamaño y Resolución</h3>
            <p>La imagen debe tener al menos <strong>1500x1500px</strong> (300 PPP) de resolución y un peso máximo recomendado de 10 MB para simular correctamente los resultados.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
            <h3 className="text-krypton" style={{ marginBottom: '1rem' }}>3. Cómo Continuar</h3>
            <p>Completa el <strong>Formulario de Cotización</strong> debajo de esta sección con los detalles del producto que deseas. Al darle a enviar, subiremos tu archivo a máxima calidad segura y te comunicaremos directo a nuestro WhatsApp Oficial.</p>
          </div>
        </div>
      </div>
      
      <CustomDesigns />
    </div>
  );
};

export default CustomDesignView;
