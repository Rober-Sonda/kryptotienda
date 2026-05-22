import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, runTransaction, orderBy } from 'firebase/firestore';

export interface SaleItemRawMaterial {
  rawMaterialId: string;
  name: string;
  quantity: number;
  costAtTime: number;
}

export interface Sale {
  id?: string;
  productId: string;
  productTitle: string;
  sizeName: string;
  quantitySold: number;
  priceSold: number;
  totalCost: number;
  profit: number;
  itemsUsed: SaleItemRawMaterial[];
  date: number;
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'sales'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Sale[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as Sale);
      });
      setSales(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching sales: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerSale = async (
    productId: string,
    productTitle: string,
    sizeName: string,
    quantitySold: number,
    priceSold: number,
    itemsUsed: SaleItemRawMaterial[]
  ) => {
    try {
      await runTransaction(db, async (transaction) => {
        // 1. Read Product
        const productRef = doc(db, 'products', productId);
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists()) throw new Error("Producto no encontrado");
        
        const productData = productSnap.data();
        let newSizes = productData.sizes || [];
        
        // 2. Read Raw Materials
        const rawMaterialsRefs = itemsUsed.map(item => ({
          ref: doc(db, 'rawMaterials', item.rawMaterialId),
          quantity: item.quantity
        }));
        
        const rawMaterialsSnaps = await Promise.all(
          rawMaterialsRefs.map(rm => transaction.get(rm.ref))
        );

        // Calculate Cost & Profit
        let totalCost = 0;
        itemsUsed.forEach(item => {
          totalCost += item.costAtTime * item.quantity;
        });
        const profit = priceSold - totalCost;

        // 3. Update Product Size Stock
        if (sizeName) {
          const sizeIndex = newSizes.findIndex((s: any) => s.name === sizeName);
          if (sizeIndex !== -1) {
            newSizes[sizeIndex].stock = Math.max(0, newSizes[sizeIndex].stock - quantitySold);
            transaction.update(productRef, { sizes: newSizes });
          }
        }

        // 4. Update Raw Materials Stock
        rawMaterialsSnaps.forEach((rmSnap, index) => {
          if (rmSnap.exists()) {
            const currentStock = rmSnap.data().stock || 0;
            const deductQty = rawMaterialsRefs[index].quantity;
            transaction.update(rawMaterialsRefs[index].ref, {
              stock: Math.max(0, currentStock - deductQty)
            });
          }
        });

        // 5. Register Sale
        const saleRef = doc(collection(db, 'sales'));
        transaction.set(saleRef, {
          productId,
          productTitle,
          sizeName,
          quantitySold,
          priceSold,
          totalCost,
          profit,
          itemsUsed,
          date: Date.now()
        });
      });
      return true;
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      throw error;
    }
  };

  return { sales, loading, registerSale };
};
