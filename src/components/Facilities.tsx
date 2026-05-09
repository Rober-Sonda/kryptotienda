import React from 'react';
import './Facilities.css';

import { useFacilities } from '../hooks/useFacilities';

const Facilities: React.FC = () => {
  const { facilities, loading } = useFacilities();
  return (
    <section id="instalaciones" className="facilities-section">
      <div className="section-header text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="section-title">Nuestras Instalaciones</h2>
        <div className="section-line"></div>
        <p className="facilities-subtitle">¿Eres de la zona? ¡Ven a vivir la experiencia Krypton en persona!</p>
      </div>
      
      <div className="facilities-grid">
        {loading ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-muted)' }}>
            <p>Cargando instalaciones...</p>
          </div>
        ) : facilities.map((item) => (
          <div key={item.id} className={`facility-card glass-panel protected-media ${item.size}`}>
            <img 
              src={item.image} 
              alt={item.title} 
              className="facility-image no-drag"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="facility-overlay">
              <div className="facility-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button className="neon-btn small-btn">Visítanos</button>
              </div>
            </div>
          </div>
        ))}
        {!loading && facilities.length === 0 && (
          <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-muted)' }}>
            <p>No hay instalaciones disponibles en este momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Facilities;
