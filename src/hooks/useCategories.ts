import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

export interface Category {
  id?: string;
  slug: string;
  name: string;
  shortName?: string;
  subcategories: string[];
  showOnHome: boolean;
  homeOrder: number;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('homeOrder', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as Category);
      });
      setCategories(cats);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching categories: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    return await addDoc(collection(db, 'categories'), category);
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    const docRef = doc(db, 'categories', id);
    return await updateDoc(docRef, data);
  };

  const removeCategory = async (id: string) => {
    const docRef = doc(db, 'categories', id);
    return await deleteDoc(docRef);
  };

  return { categories, loading, addCategory, updateCategory, removeCategory };
};
