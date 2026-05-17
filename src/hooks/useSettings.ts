import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface FooterSettings {
  showContact: boolean;
  address: string;
  phone: string;
  email: string;
  mapLink: string;
  slogan: string;
  showCategories: boolean;
  showSocial: boolean;
  showTrustedCompanies?: boolean;
}

const defaultSettings: FooterSettings = {
  showContact: true,
  address: "La Rioja 1366, 9 de julio (6500), Argentina",
  phone: "+54 9 2317 53-4545",
  email: "contacto@krypton-tienda.com",
  mapLink: "https://www.google.com/maps/place/Krypton/@-35.446565,-60.8873071,17z/data=!4m15!1m8!3m7!1s0x95bf0d95512b0001:0x1f37147b97b420d0!2sLa+Rioja+1366,+B6500+9+de+Julio,+Provincia+de+Buenos+Aires!3b1!8m2!3d-35.446565!4d-60.8847322!16s%2Fg%2F11lcnct3rs!3m5!1s0x95bf0dd142354013:0xb01b6be8757470f2!8m2!3d-35.446565!4d-60.8847322!16s%2Fg%2F11vrd9lh08",
  slogan: "Descubre tu gran debilidad.",
  showCategories: true,
  showSocial: true,
  showTrustedCompanies: true
};

export const useSettings = () => {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'config', 'footer');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as FooterSettings);
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateSettings = async (newSettings: Partial<FooterSettings>) => {
    const docRef = doc(db, 'config', 'footer');
    await setDoc(docRef, newSettings, { merge: true });
  };

  return { settings, loading, updateSettings, defaultSettings };
};
