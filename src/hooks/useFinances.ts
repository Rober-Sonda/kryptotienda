import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';

export type TransactionType = 'income' | 'expense' | 'investment';

export interface FinanceTransaction {
  id?: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string; // 'insumos', 'servicios', 'marketing', 'otros'
  date: number;
}

export const useFinances = () => {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'finances'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: FinanceTransaction[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as FinanceTransaction);
      });
      setTransactions(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching finances: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addTransaction = async (transaction: Omit<FinanceTransaction, 'id' | 'date'>) => {
    return await addDoc(collection(db, 'finances'), {
      ...transaction,
      date: Date.now()
    });
  };

  const removeTransaction = async (id: string) => {
    const docRef = doc(db, 'finances', id);
    return await deleteDoc(docRef);
  };

  return { transactions, loading, addTransaction, removeTransaction };
};
