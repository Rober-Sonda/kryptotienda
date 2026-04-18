import React from 'react';
import './Facilities.css';

const facilitiesData = [
  {
    id: 1,
    image: '/local-real-3.jpg',
    title: '1366 La Rioja',
    description: 'Nuestra fachada principal te espera con el mejor ambiente de la ciudad.',
    size: 'large'
  },
  {
    id: 2,
    image: '/local-real-1.jpg',
    title: 'Exhibiciones Épicas',
    description: 'Nuestra vidriera está siempre armada con lo último en tendencia geek y deportiva.',
    size: 'medium'
  },
  {
    id: 3,
    image: '/local-gen-1.png',
    title: 'Diseños de Alta Calidad',
    description: 'Renovamos nuestro stock de remeras constantemente. ¡Ven y pruébate la tuya!',
    size: 'small'
  },
  {
    id: 4,
    image: '/local-real-2.jpg',
    title: 'Mercancía Exclusiva',
    description: 'Decenas de tazas, llaveros y figuras de tus animes favoritos listos para llevar.',
    size: 'medium'
  },
  {
    id: 5,
    image: '/local-gen-2.png',
    title: 'Coleccionables Únicos',
    description: 'Encuentra ese regalo perfecto o la pieza que le falta a tu estantería.',
    size: 'small'
  },
  {
    id: 6,
    image: '/local-gen-3.png',
    title: 'Premium Apparel',
    description: 'Te asesoramos para que encuentres exactamente el diseño que tienes en mente.',
    size: 'small'
  },
  {
    id: 7,
    image: '/local-gen-4.png',
    title: 'Experiencia KRYPTON',
    description: 'No somos solo una tienda, somos un punto de encuentro para apasionados del anime.',
    size: 'large'
  }
];

const Facilities: React.FC = () => {
  return (
    <section id="instalaciones" className="facilities-section">
      <div className="section-header text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="section-title">Nuestras Instalaciones</h2>
        <div className="section-line"></div>
        <p className="facilities-subtitle">¿Eres de la zona? ¡Ven a vivir la experiencia Krypton en persona!</p>
      </div>
      
      <div className="facilities-grid">
        {facilitiesData.map((item) => (
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
      </div>
    </section>
  );
};

export default Facilities;
