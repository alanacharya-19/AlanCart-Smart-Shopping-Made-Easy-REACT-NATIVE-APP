import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProductImage {
  id: string;
  uri: string;
}

interface ProductCarouselProps {
  images: ProductImage[];
  height?: number;
  onBackPress?: () => void;
}

export default function ProductCarousel({ images, height, onBackPress }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Image Carousel */}
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.imageContainer, { width: SCREEN_WIDTH }]}>
            <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
      />

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <TouchableOpacity 
          style={[styles.navButton, styles.leftNav]}
          onPress={goToPrevious}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      
      {currentIndex < images.length - 1 && (
        <TouchableOpacity 
          style={[styles.navButton, styles.rightNav]}
          onPress={goToNext}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={32} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
        <Text style={styles.imageCounter}>
          {currentIndex + 1} / {images.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leftNav: {
    left: 16,
  },
  rightNav: {
    right: 16,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
    borderRadius: 4,
  },
  imageCounter: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
