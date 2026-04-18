import React from 'react';
import { MapPin, Phone, Mail, Share2, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top-gradient"></div>
      
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo1.jpg" alt="Krypton Logo" className="footer-logo-img" />
            <span className="footer-logo-text text-krypton">KRYPTON</span>
          </div>
          <p className="footer-slogan">Descubre tu gran debilidad.</p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Compartir"><Share2 size={22} /></a>
            <a href="#" className="social-link" aria-label="Chat"><MessageCircle size={22} /></a>
          </div>
        </div>
        
        <div className="footer-links-group">
          <h4 className="footer-title">Categorías</h4>
          <ul className="footer-links">
            <li><a href="#anime">Anime</a></li>
            <li><a href="#retro">Videojuegos Clásicos</a></li>
            <li><a href="#gym">Gym & Fitness</a></li>
            <li><a href="#simpsons">Los Simpsons</a></li>
          </ul>
        </div>
        
        <div className="footer-links-group">
          <h4 className="footer-title">Contacto</h4>
          <ul className="footer-links contact-info">
            <li>
              <MapPin size={18} className="text-krypton" />
              <a 
                href="https://www.google.com/maps/place/Krypton/@-35.446565,-60.8873071,17z/data=!4m15!1m8!3m7!1s0x95bf0d95512b0001:0x1f37147b97b420d0!2sLa+Rioja+1366,+B6500+9+de+Julio,+Provincia+de+Buenos+Aires!3b1!8m2!3d-35.446565!4d-60.8847322!16s%2Fg%2F11lcnct3rs!3m5!1s0x95bf0dd142354013:0xb01b6be8757470f2!8m2!3d-35.446565!4d-60.8847322!16s%2Fg%2F11vrd9lh08" 
                target="_blank"  
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                La Rioja 1366, 9 de julio (6500), Argentina
              </a>
            </li>
            <li>
              <Phone size={18} className="text-krypton" />
              <span>+54 9 2317 53-4545</span>
            </li>
            <li>
              <Mail size={18} className="text-krypton" />
              <span>contacto@krypton-tienda.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Krypton Tienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
