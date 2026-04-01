import { Order } from '@/types';
import { Storage } from '@/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Minimal order data for storage (to avoid SecureStore 2KB limit)
interface StoredOrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface StoredOrder {
  id: string;
  date: string;
  total: number;
  status: 'processing' | 'pending' | 'shipped' | 'delivered';
  items: StoredOrderItem[];
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (items: any[], total: number) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await Storage.getItem('orders');
        if (savedOrders) {
          const storedOrders: StoredOrder[] = JSON.parse(savedOrders);
          // Convert back to full Order format
          setOrders(storedOrders.map(order => ({
            id: order.id,
            date: order.date,
            total: order.total,
            status: order.status,
            items: order.items.map(item => ({
              product: {
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                category: '',
                description: '',
                rating: 0,
                reviews: 0,
                inStock: true,
              },
              quantity: item.quantity,
            })),
          })));
        }
      } catch (e) {
        console.error('Failed to load orders:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    const saveOrders = async () => {
      if (loaded) {
        try {
          // Store only minimal data to avoid 2KB limit
          const storedOrders: StoredOrder[] = orders.map(order => ({
            id: order.id,
            date: order.date,
            total: order.total,
            status: order.status,
            items: order.items.map(item => ({
              productId: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
              quantity: item.quantity,
            })),
          }));
          await Storage.setItem('orders', JSON.stringify(storedOrders));
        } catch (e) {
          console.error('Failed to save orders:', e);
        }
      }
    };
    saveOrders();
  }, [orders, loaded]);

  const placeOrder = (items: any[], total: number): Order => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      total,
      status: 'processing',
      items,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder; // Return the order for notifications
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
