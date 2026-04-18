import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <section className="about-krypton-section" id="nosotros">
      <div className="container">
        <div className="about-krypton-card">
          <div className="about-krypton-content">
            <h2 className="neon-title about-title">
              EL ORIGEN DE <span>KRYPTON</span>
            </h2>
            <div className="about-text-glow">
              <p>
                Cuenta la leyenda que Krypton era el majestuoso planeta natal del Hombre de Acero, la cuna de un poder cósmico inigualable. Pero para el resto de los mortales, y sobre todo cuando entra en contacto con la atmósfera terrestre, la roca de ese mundo representa una sola cosa: <strong>Su mayor debilidad</strong>.
              </p>
              <p>
                Y es exactamente eso en lo que nos hemos convertido. Nuestro nombre no es ninguna coincidencia. Al atravesar las puertas digitales de <strong>Krypton Tienda</strong>, estás entrando en un santuario absoluto de la cultura pop, diseñado meticulosamente para irradiar esa misma frecuencia.
              </p>
              <p>
                Desde la energía demoledora de la raza Saiyajin, el cosmos de los Caballeros, hasta las risas nostálgicas de la televisión de los 90s y la eterna gloria de la Escaloneta de tres estrellas. Todo converge en este vórtice.
              </p>
              <p className="epic-punchline">
                Esta es tu kriptonita. Es ese instinto incontrolable de pasear por nuestro catálogo, mirar las estampas y sentir que <em>"te queres llevar todo"</em>. No luches contra ello; la voluntad de sucumbir ante colecciones épicas es el verdadero superpoder.
              </p>
              <p className="epic-welcome">
                Caíste en la radiación. Bienvenido a tu nueva debilidad. <strong>Bienvenido a KRYPTON.</strong>
              </p>
            </div>
          </div>
          <div className="about-krypton-visual">
            <div className="meteor-glow"></div>
            <img src="/logo-bg.jpg" alt="El Núcleo de Krypton" className="about-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
