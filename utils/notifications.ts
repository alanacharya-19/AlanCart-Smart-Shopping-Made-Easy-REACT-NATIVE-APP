import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowInForeground: true,
  }),
});

/**
 * Request permission to send notifications
 */
export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Send an order confirmation notification
 */
export async function sendOrderNotification(orderId: string, total: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Order Placed Successfully!',
      body: `Your order #${orderId.split('-')[1]} has been confirmed. Total: $${total.toFixed(2)}`,
      data: { orderId, type: 'order_confirmation' },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Send immediately
  });
}

/**
 * Send a shipping update notification
 */
export async function sendShippingNotification(orderId: string, status: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📦 Order Update',
      body: `Your order #${orderId.split('-')[1]} is now ${status}`,
      data: { orderId, status, type: 'shipping_update' },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}

/**
 * Send a promotional notification
 */
export async function sendPromoNotification(title: string, message: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: message,
      data: { type: 'promotion' },
      sound: true,
    },
    trigger: null,
  });
}
