import Button from '@/components/Button';
import ProductCarousel from '@/components/ProductCarousel';
import { useCart } from '@/contexts/CartContext';
import { moreProducts } from '@/data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ProductDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = moreProducts.find((p) => p.id === id);

  // Generate multiple images for the product (main image + variations)
  const productImages = useMemo(() => {
    if (!product) return [];
    
    // Create array of images (main image + 2-3 additional angles/variations)
    const images = [
      { id: 'main', uri: product.image },
      { id: 'angle1', uri: `${product.image.split('?')[0]}?w=500&angle=1` },
      { id: 'angle2', uri: `${product.image.split('?')[0]}?w=500&angle=2` },
      { id: 'detail', uri: `${product.image.split('?')[0]}?w=500&detail=close` },
    ];
    
    return images;
  }, [product]);

  // Get recommended products (same category)
  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    return moreProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4); // Show max 4 recommendations
  }, [product]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('../checkout');
  };

  // Calculate heights based on screen
  const imageHeight = SCREEN_HEIGHT * 0.4; // 40% for image carousel
  const contentHeight = SCREEN_HEIGHT * 0.4; // 40% for product info

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOP 40% - Product Image Carousel */}
        <ProductCarousel 
          images={productImages}
          height={imageHeight}
          onBackPress={() => router.back()}
        />

        {/* MIDDLE 40% - Product Information */}
        <View style={[styles.contentSection, { minHeight: contentHeight }]}>
          {/* Title & Rating */}
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviews}>({product.reviews} reviews)</Text>
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>
                  ${product.originalPrice.toFixed(2)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Stock Status */}
          {product.inStock ? (
            <View style={styles.inStockBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={styles.inStockText}>In Stock</Text>
              <Ionicons name="car-sport-outline" size={16} color="#007AFF" style={styles.deliveryIcon} />
              <Text style={styles.deliveryText}>Free Delivery</Text>
            </View>
          ) : (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryBadge}>
              <Ionicons name="pricetag-outline" size={16} color="#007AFF" />
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!product.inStock}
              >
                <Ionicons name="remove" size={20} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
                disabled={!product.inStock}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Price */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${(product.price * quantity).toFixed(2)}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Add to Cart"
              onPress={handleAddToCart}
              variant="outline"
              disabled={!product.inStock}
              style={styles.cartButton}
            />
            <Button
              title="Buy Now"
              onPress={handleBuyNow}
              disabled={!product.inStock}
              style={styles.buyButton}
            />
          </View>
        </View>

        {/* BOTTOM 20% - Recommended Products */}
        {recommendedProducts.length > 0 && (
          <View style={styles.recommendationsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleLarge}>Recommended</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsList}
            >
              {recommendedProducts.map((recProduct) => (
                <TouchableOpacity
                  key={recProduct.id}
                  style={styles.recommendationCard}
                  onPress={() => router.push(`./${recProduct.id}`)}
                >
                  <Image 
                    source={{ uri: recProduct.image }} 
                    style={styles.recommendationImage}
                    resizeMode="cover"
                  />
                  <View style={styles.recommendationInfo}>
                    <Text style={styles.recommendationName} numberOfLines={1}>
                      {recProduct.name}
                    </Text>
                    <Text style={styles.recommendationPrice}>
                      ${recProduct.price.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  inStockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 4,
    marginRight: 12,
  },
  deliveryIcon: {
    marginLeft: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  outOfStock: {
    backgroundColor: '#fff5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  outOfStockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cartButton: {
    flex: 1,
  },
  buyButton: {
    flex: 1,
  },
  contentSection: {
    padding: 16,
  },
  recommendationsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sectionTitleLarge: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  recommendationsList: {
    paddingHorizontal: 4,
  },
  recommendationCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationImage: {
    width: '100%',
    height: 140,
  },
  recommendationInfo: {
    padding: 10,
  },
  recommendationName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
});
