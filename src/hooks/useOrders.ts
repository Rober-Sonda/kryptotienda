import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, orderBy, where } from 'firebase/firestore';
import { useSettings } from './useSettings';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: string;
  quantity: number;
  size?: string;
  image?: string;
}

export interface Order {
  id?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  wasEdited?: boolean;
}

export const useOrders = (customerId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    if (customerId) {
      q = query(collection(db, 'orders'), where('customerId', '==', customerId), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => {
        ords.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ords);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [customerId]);

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Date.now()
    });
    return docRef.id;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const docRef = doc(db, 'orders', id);
    return await updateDoc(docRef, { status });
  };

  const editOrderItems = async (id: string, items: OrderItem[], total: number) => {
    const docRef = doc(db, 'orders', id);
    return await updateDoc(docRef, { items, total, wasEdited: true });
  };

  const clearEditedFlag = async (id: string) => {
    const docRef = doc(db, 'orders', id);
    return await updateDoc(docRef, { wasEdited: false });
  };

  return { orders, loading, addOrder, updateOrderStatus, editOrderItems, clearEditedFlag };
};

// Hook for generating Whatsapp message
export const useOrderWhatsApp = () => {
  const { settings } = useSettings();
  
  const generateMessage = (order: Order) => {
    let message = `*NUEVO PEDIDO - KRYPTON*\n`;
    if (order.wasEdited) {
      message = `*PEDIDO ACTUALIZADO - KRYPTON*\n`;
    }
    message += `ID: ${order.id || 'Nuevo'}\n`;
    message += `Cliente: ${order.customerName}\n`;
    message += `Teléfono: ${order.customerPhone}\n\n`;
    message += `*Detalle:*\n`;
    
    order.items.forEach(item => {
      message += `- ${item.quantity}x ${item.title} ${item.size ? `(${item.size})` : ''} - ${item.price}\n`;
    });
    
    message += `\n*Total:* $${order.total.toFixed(2)}`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = settings?.phone?.replace(/\D/g, '') || '5491100000000';
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  return { generateMessage };
};
