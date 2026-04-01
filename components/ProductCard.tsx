import { category, neutral, opacity, primary, semantic, shadows, status, text } from '@/constants/colors';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  // Get category color
  const getCategoryColor = () => {
    return category[product.category as keyof typeof category] || primary.blue;
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        onPress={() => router.push(`./product/${product.id}`)} 
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          {!product.inStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color={semantic.starFilled} />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews})</Text>
        </View>
        
        {/* Price with Add to Cart Icon */}
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ${product.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
          
          {product.inStock && (
            <TouchableOpacity 
              style={[styles.addToCartIcon, { backgroundColor: opacity.primary10 }]}
              onPress={handleAddToCart}
              activeOpacity={0.7}
            >
              <Ionicons name="cart" size={22} color={primary.blue} />
            </TouchableOpacity>
          )}
        </View>
        
        {product.originalPrice && (
          <View style={[styles.discountBadge, { backgroundColor: semantic.badgeSale }]}>
            <Ionicons name="pricetag" size={10} color={neutral.white} />
            <Text style={styles.discountText}>
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: neutral.white,
    borderRadius: 16,
    overflow: 'hidden',
    margin: 6,
    shadowColor: shadows.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    flex: 1,
    maxWidth: (SCREEN_WIDTH - 48) / 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: neutral.gray100,
  },
  content: {
    padding: 12,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: text.primary,
    marginBottom: 6,
    lineHeight: 18,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    marginRight: 4,
    fontSize: 13,
    fontWeight: '600',
    color: text.secondary,
  },
  reviews: {
    fontSize: 11,
    color: text.tertiary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: semantic.priceCurrent,
  },
  originalPrice: {
    fontSize: 13,
    color: semantic.priceOriginal,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addToCartIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },
  discountText: {
    color: neutral.white,
    fontSize: 11,
    fontWeight: '700',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: status.error,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    shadowColor: shadows.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  outOfStockText: {
    color: neutral.white,
    fontSize: 11,
    fontWeight: '700',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    shadowColor: shadows.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    color: neutral.white,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
