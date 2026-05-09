import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

export interface Facility {
  id?: string;
  image: string;
  title: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  order?: number;
  createdAt?: number;
}

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'facilities'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const facs: Facility[] = [];
      snapshot.forEach((doc) => {
        facs.push({ id: doc.id, ...doc.data() } as Facility);
      });
      setFacilities(facs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching facilities: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addFacility = async (facility: Omit<Facility, 'id'>) => {
    return await addDoc(collection(db, 'facilities'), {
      ...facility,
      createdAt: Date.now()
    });
  };

  const updateFacility = async (id: string, data: Partial<Facility>) => {
    const docRef = doc(db, 'facilities', id);
    return await updateDoc(docRef, data);
  };

  const removeFacility = async (id: string) => {
    const docRef = doc(db, 'facilities', id);
    return await deleteDoc(docRef);
  };

  return { facilities, loading, addFacility, updateFacility, removeFacility };
};
