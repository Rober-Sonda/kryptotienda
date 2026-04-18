import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Detecta si es un dispositivo móvil / touch para usar redirect en lugar de popup
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // Maneja el resultado del redirect de Google (solo en móvil)
    if (isMobile) {
      getRedirectResult(auth).then((result) => {
        if (result?.user) {
          setCurrentUser(result.user);
        }
      }).catch((err) => {
        console.error('Redirect sign-in error:', err);
      });
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    // En móvil (iOS/Android), los popups son bloqueados por el navegador.
    // Usamos redirect en móvil y popup en desktop.
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error("Error signing in", error);
      // Fallback: intenta con popup si redirect falla
      try {
        await signInWithPopup(auth, googleProvider);
      } catch {
        alert("Hubo un error al iniciar sesión. Por favor intenta de nuevo.");
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginWithGoogle, logout, loading, showLoginPrompt, setShowLoginPrompt }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
