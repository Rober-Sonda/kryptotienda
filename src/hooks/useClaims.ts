import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, orderBy, where } from 'firebase/firestore';

export type ClaimStatus = 'open' | 'in_progress' | 'resolved' | 'rejected';

export interface Claim {
  id?: string;
  orderNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  reason: string;
  status: ClaimStatus;
  resolutionNotes?: string;
  createdAt: number;
}

export const useClaims = (customerId?: string) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'claims'), orderBy('createdAt', 'desc'));
    
    if (customerId) {
      q = query(collection(db, 'claims'), where('customerId', '==', customerId), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cls: Claim[] = [];
      snapshot.forEach((doc) => {
        cls.push({ id: doc.id, ...doc.data() } as Claim);
      });
      setClaims(cls);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching claims: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [customerId]);

  const addClaim = async (claim: Omit<Claim, 'id' | 'createdAt' | 'status'>) => {
    const docRef = await addDoc(collection(db, 'claims'), {
      ...claim,
      status: 'open',
      createdAt: Date.now()
    });
    return docRef.id;
  };

  const updateClaimStatus = async (id: string, status: ClaimStatus, resolutionNotes?: string) => {
    const docRef = doc(db, 'claims', id);
    const updateData: any = { status };
    if (resolutionNotes) {
      updateData.resolutionNotes = resolutionNotes;
    }
    return await updateDoc(docRef, updateData);
  };

  return { claims, loading, addClaim, updateClaimStatus };
};
