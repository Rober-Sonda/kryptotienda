import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

export interface Product {
  id?: string;
  title: string;
  image: string;
  price: string;
  offerPrice?: string;
  category: 'anime' | 'retro' | 'gym' | 'simpsons' | 'argentina';
  subcategory?: string;
  mockupBg?: 'black' | 'white';
  isActive?: boolean;
  isMadeToOrder?: boolean;
  createdAt?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    return await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: Date.now(),
      isActive: product.isActive !== undefined ? product.isActive : true,
      isMadeToOrder: product.isMadeToOrder || false
    });
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const docRef = doc(db, 'products', id);
    return await updateDoc(docRef, data);
  };

  const removeProduct = async (id: string) => {
    const docRef = doc(db, 'products', id);
    return await deleteDoc(docRef);
  };

  return { products, loading, addProduct, updateProduct, removeProduct };
};
