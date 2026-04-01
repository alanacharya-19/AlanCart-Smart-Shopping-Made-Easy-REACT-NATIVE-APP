import NotificationItem from '@/components/NotificationItem';
import { useOrders } from '@/contexts/OrderContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
}

export default function MessagePage() {
  const { orders } = useOrders();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Generate notifications from orders
    const orderNotifications: Notification[] = orders.map((order) => ({
      id: `notif-${order.id}`,
      title: 'Order Update',
      message: `Your order #${order.id.split('-')[1]} is now ${order.status}`,
      date: order.date,
      type: 'order' as const,
      read: false,
    }));

    // Add some sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: 'promo-1',
        title: 'Special Offer',
        message: 'Get 20% off on your next purchase! Use code: SAVE20',
        date: new Date().toISOString(),
        type: 'promo' as const,
        read: false,
      },
      {
        id: 'system-1',
        title: 'Welcome to Ecoom',
        message: 'Thank you for joining us. Start exploring amazing products!',
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'system' as const,
        read: true,
      },
    ];

    return [...orderNotifications, ...sampleNotifications].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You'll see updates about your orders and promotions here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationItem 
                item={item} 
                onDelete={handleDeleteNotification}
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  markAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
