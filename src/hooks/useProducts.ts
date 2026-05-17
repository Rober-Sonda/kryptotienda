import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

export interface ProductSize {
  name: string;
  stock: number;
  minStock: number;
}

export interface ProductBOM {
  rawMaterialId: string;
  quantity: number;
}

export interface Product {
  id?: string;
  title: string;
  image: string;
  price: string;
  offerPrice?: string;
  category: string;
  subcategory?: string;
  mockupBg?: 'black' | 'white';
  isActive?: boolean;
  isMadeToOrder?: boolean;
  isFeatured?: boolean;
  sizes?: ProductSize[];
  bom?: ProductBOM[];
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
    const cleanProduct = Object.fromEntries(
      Object.entries(product).filter(([_, v]) => v !== undefined)
    );
    return await addDoc(collection(db, 'products'), {
      ...cleanProduct,
      createdAt: Date.now(),
      isActive: product.isActive !== undefined ? product.isActive : true,
      isMadeToOrder: product.isMadeToOrder || false,
      isFeatured: product.isFeatured || false
    });
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const docRef = doc(db, 'products', id);
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    return await updateDoc(docRef, cleanData);
  };

  const removeProduct = async (id: string) => {
    const docRef = doc(db, 'products', id);
    return await deleteDoc(docRef);
  };

  return { products, loading, addProduct, updateProduct, removeProduct };
};
