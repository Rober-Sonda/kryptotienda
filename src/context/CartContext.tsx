import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: number;
  title: string;
  price: string;
  image: string;
  quantity: number;
  size?: string;
  cartItemId: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity' | 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  cartTotal: number;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('krypton_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  useEffect(() => {
    localStorage.setItem('krypton_cart', JSON.stringify(items));
  }, [items]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Omit<CartItem, 'quantity' | 'cartItemId'>) => {
    setItems(currentItems => {
      const generatedCartItemId = `${product.id}-${product.size || 'uni'}`;
      const existing = currentItems.find(item => item.cartItemId === generatedCartItemId);
      if (existing) {
        return currentItems.map(item => 
          item.cartItemId === generatedCartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentItems, { ...product, quantity: 1, cartItemId: generatedCartItemId }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(currentItems => 
      currentItems.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setItems([]);

  // Calculate total explicitly stripping the $ sign
  const cartTotal = items.reduce((total, item) => {
    const numericPrice = parseFloat(item.price.replace('$', ''));
    return total + (numericPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, 
      cartTotal, clearCart, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};
