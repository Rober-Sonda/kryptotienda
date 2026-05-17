import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

export interface RawMaterial {
  id?: string;
  name: string;
  category: string; // e.g., 'bolsa', 'tinta', 'cinta', 'papel'
  cost: number;
  stock: number;
  minStock: number;
  createdAt?: number;
}

export const useRawMaterials = () => {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'rawMaterials'), orderBy('category', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: RawMaterial[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as RawMaterial);
      });
      setRawMaterials(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching raw materials: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addRawMaterial = async (material: Omit<RawMaterial, 'id'>) => {
    return await addDoc(collection(db, 'rawMaterials'), {
      ...material,
      createdAt: Date.now()
    });
  };

  const updateRawMaterial = async (id: string, data: Partial<RawMaterial>) => {
    const docRef = doc(db, 'rawMaterials', id);
    return await updateDoc(docRef, data);
  };

  const removeRawMaterial = async (id: string) => {
    const docRef = doc(db, 'rawMaterials', id);
    return await deleteDoc(docRef);
  };

  return { rawMaterials, loading, addRawMaterial, updateRawMaterial, removeRawMaterial };
};
