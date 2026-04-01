import { CartItem, Product } from '@/types';
import { Storage } from '@/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Minimal product data for storage (to avoid SecureStore 2KB limit)
interface StoredProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface StoredCartItem {
  product: StoredProduct;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await Storage.getItem('cart');
        if (savedCart) {
          const storedCart: StoredCartItem[] = JSON.parse(savedCart);
          // Convert back to full CartItem format
          setCart(storedCart.map(item => ({
            product: {
              ...item.product,
              description: '',
              rating: 0,
              reviews: 0,
              inStock: true,
              originalPrice: undefined,
            },
            quantity: item.quantity,
          })));
        }
      } catch (e) {
        console.error('Failed to load cart:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (loaded) {
        try {
          // Store only minimal data to avoid 2KB limit
          const storedCart: StoredCartItem[] = cart.map(item => ({
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
              category: item.product.category,
            },
            quantity: item.quantity,
          }));
          await Storage.setItem('cart', JSON.stringify(storedCart));
        } catch (e) {
          console.error('Failed to save cart:', e);
        }
      }
    };
    saveCart();
  }, [cart, loaded]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
