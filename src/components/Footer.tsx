import React from 'react';
import { MapPin, Phone, Mail, Share2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings.ts';
import { useCategories } from '../hooks/useCategories.ts';
import './Footer.css';

const Footer: React.FC = () => {
  const { settings, defaultSettings } = useSettings();
  const { categories } = useCategories();
  const data = { ...defaultSettings, ...(settings || {}) };

  return (
    <footer className="footer">
      <div className="footer-top-gradient"></div>
      
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo1.jpg" alt="Krypton Logo" className="footer-logo-img" />
            <span className="footer-logo-text text-krypton">KRYPTON</span>
          </div>
          <p className="footer-slogan">{data.slogan}</p>
          {data.showSocial && (
            <div className="social-links">
              <a href="#" onClick={(e) => e.preventDefault()} className="social-link" aria-label="Compartir"><Share2 size={22} /></a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-link" aria-label="Chat"><MessageCircle size={22} /></a>
            </div>
          )}
        </div>
        
        {data.showCategories && (
          <div className="footer-links-group">
            <h4 className="footer-title">Categorías</h4>
            <ul className="footer-links">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}><Link to={`/store?category=${cat.slug}`}>{cat.name}</Link></li>
              ))}
              {categories.length === 0 && (
                <li><Link to="/store">Catálogo Completo</Link></li>
              )}
            </ul>
          </div>
        )}
        
        {data.showContact && (
          <div className="footer-links-group">
            <h4 className="footer-title">Contacto</h4>
            <ul className="footer-links contact-info">
              <li>
                <MapPin size={18} className="text-krypton" />
                <a 
                  href={data.mapLink} 
                  target="_blank"  
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  {data.address}
                </a>
              </li>
              <li>
                <Phone size={18} className="text-krypton" />
                <span>{data.phone}</span>
              </li>
              <li>
                <Mail size={18} className="text-krypton" />
                <span>{data.email}</span>
              </li>
            </ul>
          </div>
        )}
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
