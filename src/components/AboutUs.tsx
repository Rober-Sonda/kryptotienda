import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <section className="cinematic-about-section" id="nosotros">
      {/* Background Layer */}
      <div className="about-ambient-background">
        <div className="about-image-layer"></div>
        <div className="about-gradient-overlay"></div>
      </div>

      <div className="container about-container">
        {/* Floating Glass Terminal */}
        <div className="krypton-glass-terminal">
          <div className="terminal-header">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">SYS.KRYPTON // DECRYPTING LORE</span>
          </div>
          
          <div className="terminal-body">
            <h2 className="neon-title about-title-main">
              EL ORIGEN DE <span>KRYPTON</span>
            </h2>
            
            <div className="about-text-glow">
              <p>
                Cuenta la leyenda que Krypton era el majestuoso planeta natal del Hombre de Acero, la cuna de un poder cósmico inigualable. Pero para el resto de los mortales, y sobre todo cuando entra en contacto con la atmósfera terrestre, la roca de ese mundo representa una sola cosa: <strong>Su mayor debilidad</strong>.
              </p>
              
              <div className="data-divider"></div>
              
              <p>
                Y es exactamente eso en lo que nos hemos convertido. Nuestro nombre no es ninguna coincidencia. Al atravesar las puertas digitales de <span className="highlight-green">Krypton Tienda</span>, estás entrando en un santuario absoluto de la cultura pop, diseñado meticulosamente para irradiar esa misma frecuencia.
              </p>
              
              <p>
                Desde la energía demoledora de la raza Saiyajin, el cosmos de los Caballeros, hasta las risas nostálgicas de la televisión de los 90s y la eterna gloria de la Escaloneta de tres estrellas. Todo converge en este vórtice.
              </p>
              
              <div className="epic-punchline">
                <i className="punchline-icon">⚠️</i>
                <p>Esta es tu kriptonita. Es ese instinto incontrolable de pasear por nuestro catálogo, mirar las estampas y sentir que <em>"te queres llevar todo"</em>. No luches contra ello; la voluntad de sucumbir ante colecciones épicas es el verdadero superpoder.</p>
              </div>
              
              <p className="epic-welcome">
                Caíste en la radiación. Bienvenido a tu nueva debilidad. <br/>
                <span className="glitch-text" data-text="Bienvenido a KRYPTON.">Bienvenido a KRYPTON.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
