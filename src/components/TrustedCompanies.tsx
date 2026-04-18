import React from 'react';
import { Shield, Target, Zap, Anchor, Hexagon, Triangle, Circle, Square, Command, Activity, Compass, Cpu, Globe, Rocket, Aperture } from 'lucide-react';
import './TrustedCompanies.css';

const companies: React.FC[] = [
  () => <div className="company-logo"><Shield size={32} /> <span>SecurityCorp</span></div>,
  () => <div className="company-logo"><Activity size={32} /> <span>CrossFit Alpha</span></div>,
  () => <div className="company-logo"><Zap size={32} /> <span>EnergyDrink Pro</span></div>,
  () => <div className="company-logo"><Target size={32} /> <span>Bullseye Gym</span></div>,
  () => <div className="company-logo"><Cpu size={32} /> <span>Tech Hardware Inc.</span></div>,
  () => <div className="company-logo"><Anchor size={32} /> <span>Puerto Fitness</span></div>,
  () => <div className="company-logo"><Hexagon size={32} /> <span>Hexa Games</span></div>,
  () => <div className="company-logo"><Rocket size={32} /> <span>Startup Boost</span></div>,
  () => <div className="company-logo"><Globe size={32} /> <span>Global Imports</span></div>,
  () => <div className="company-logo"><Compass size={32} /> <span>Rutas Enduro</span></div>,
  () => <div className="company-logo"><Aperture size={32} /> <span>Studio Focus</span></div>,
  () => <div className="company-logo"><Command size={32} /> <span>Cmd Esports</span></div>,
  () => <div className="company-logo"><Triangle size={32} /> <span>Pyramid Events</span></div>,
  () => <div className="company-logo"><Circle size={32} /> <span>O-Ring Auto</span></div>,
  () => <div className="company-logo"><Square size={32} /> <span>Block CrossFit</span></div>,
];

const TrustedCompanies: React.FC = () => {
  return (
    <section className="trusted-companies-section">
      <div className="trusted-header text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          <span>Empresas que Confían en </span>
          <span className="title-krypton" style={{ display: 'inline-block', marginTop: '5px' }}>KRYPTON</span>
        </h2>
        <p className="trusted-subtitle" style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', maxWidth: '600px' }}>Producciones a gran escala con los estándares más altos del mercado</p>
      </div>
      
      <div className="marquee-container">
        <div className="marquee-content">
          {companies.map((Company, index) => (
            <div key={`company-a-${index}`} className="marquee-item">
              <Company />
            </div>
          ))}
          {companies.map((Company, index) => (
            <div key={`company-b-${index}`} className="marquee-item">
              <Company />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
