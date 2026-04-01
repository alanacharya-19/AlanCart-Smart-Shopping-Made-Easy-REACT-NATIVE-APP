import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="product/[id]" options={{ title: 'Product Details' }} />
              <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
            </Stack>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
