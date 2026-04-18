import React, { useEffect } from 'react';
import { X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import './AuthModal.css';

const AuthModal: React.FC = () => {
  const { showLoginPrompt, setShowLoginPrompt, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (showLoginPrompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showLoginPrompt]);

  if (!showLoginPrompt) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal glass-panel">
        <button 
          className="auth-modal-close" 
          onClick={() => setShowLoginPrompt(false)}
        >
          <X size={24} />
        </button>
        
        <div className="auth-modal-content">
          <div className="auth-icon-container">
            <LogIn size={48} className="auth-icon" />
          </div>
          <h2 className="auth-title">Acceso <span className="text-krypton">KRYPTON</span></h2>
          <p className="auth-message">
            Debes iniciar sesión con Google para añadir productos al carrito y realizar pedidos.
          </p>
          
          <button 
            className="neon-btn auth-google-btn" 
            onClick={() => {
              loginWithGoogle();
              setShowLoginPrompt(false);
            }}
          >
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
