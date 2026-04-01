import Button from '@/components/Button';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { sendOrderNotification } from '@/utils/notifications';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    email: '',
  });

  const handlePlaceOrder = async () => {
    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode || !shippingInfo.phone) {
      Alert.alert('Missing Information', 'Please fill in all shipping fields');
      return;
    }

    if (!isGuest && !shippingInfo.email) {
      Alert.alert('Missing Email', 'Please provide your email for account creation');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(async () => {
      const order = placeOrder(cart, cartTotal);
      clearCart();
      setIsProcessing(false);
      
      // Send native push notification
      try {
        await sendOrderNotification(order.id, cartTotal);
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
      
      const message = isGuest 
        ? 'Your order has been placed as a guest. You can create an account later.'
        : 'Your order has been placed successfully! Check your notifications for updates.';
      
      Alert.alert(
        'Order Placed!',
        message,
        [
          {
            text: 'OK',
            onPress: () => router.push('../(tabs)'),
          },
        ]
      );
    }, 1500);
  };

  const updateField = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            {cart.map((item) => (
              <View key={item.product.id} style={styles.summaryItem}>
                <Text style={styles.summaryName} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.summaryQuantity}>x{item.quantity}</Text>
                <Text style={styles.summaryPrice}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="John Doe"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.address}
              onChangeText={(value) => updateField('address', value)}
              placeholder="123 Main St"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.city}
                onChangeText={(value) => updateField('city', value)}
                placeholder="New York"
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.zipCode}
                onChangeText={(value) => updateField('zipCode', value)}
                placeholder="10001"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
            />
          </View>

          {/* Guest Checkout Toggle */}
          <View style={styles.guestToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, isGuest && styles.toggleActive]}
              onPress={() => setIsGuest(!isGuest)}
              activeOpacity={0.7}
            >
              <View style={styles.toggleIndicator}>
                <View style={[styles.toggleDot, isGuest && styles.toggleDotActive]} />
              </View>
              <Text style={styles.toggleText}>Checkout as Guest</Text>
            </TouchableOpacity>
            <Text style={styles.toggleSubtext}>
              {isGuest 
                ? 'No account needed. Quick and easy!' 
                : 'Create an account to track orders'}
            </Text>
          </View>

          {/* Email field for registered users */}
          {!isGuest && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          )}
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Subtotal:</Text>
            <Text style={styles.paymentValue}>${cartTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Shipping:</Text>
            <Text style={styles.paymentValue}>Free</Text>
          </View>
          <View style={[styles.paymentRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Place Order"
            onPress={handlePlaceOrder}
            loading={isProcessing}
            disabled={cart.length === 0 || isProcessing}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  summaryQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
  },
  paymentValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    padding: 16,
  },
  guestToggle: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleActive: {
    opacity: 1,
  },
  toggleIndicator: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginRight: 12,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleDotActive: {
    backgroundColor: '#007AFF',
    marginLeft: 20,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  toggleSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    marginLeft: 56,
  },
});
