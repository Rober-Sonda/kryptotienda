import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

export interface TrustedCompany {
  id?: string;
  name: string;
  logoUrl?: string;
  iconName?: string; // For legacy/hardcoded ones
  isActive: boolean;
  order: number;
}

export const useTrustedCompanies = () => {
  const [companies, setCompanies] = useState<TrustedCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'trustedCompanies'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: TrustedCompany[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as TrustedCompany);
      });
      setCompanies(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching trusted companies: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addCompany = async (company: Omit<TrustedCompany, 'id'>) => {
    return await addDoc(collection(db, 'trustedCompanies'), company);
  };

  const updateCompany = async (id: string, data: Partial<TrustedCompany>) => {
    const docRef = doc(db, 'trustedCompanies', id);
    return await updateDoc(docRef, data);
  };

  const removeCompany = async (id: string) => {
    const docRef = doc(db, 'trustedCompanies', id);
    return await deleteDoc(docRef);
  };

  return { companies, loading, addCompany, updateCompany, removeCompany };
};
