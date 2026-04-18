import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text text-center">
          <h1 className="hero-title">
            <span className="text-light">Descubre tu</span><br/>
            <span className="text-krypton static-white-glow">GRAN DEBILIDAD</span>
          </h1>
          <p className="hero-subtitle">
            Sublimados y estampados épicos. Entra y deléitate con la mejor variedad de diseños de la galaxia.
          </p>
          <div className="hero-actions">
            <a href="#instalaciones" className="neon-btn" style={{textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>Ver Instalaciones</a>
            <button className="neon-btn primary" onClick={() => navigate('/store')}>Ir a la Tienda</button>
          </div>
        </div>
      </div>
      
      <div className="hero-bottom-gradient"></div>
    </section>
  );
};

export default Hero;
