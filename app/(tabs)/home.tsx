import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { gradients, neutral, primary, shadows, text } from "@/constants/colors";
import { moreProducts } from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Hero banner data
const heroSlides = [
  {
    id: "1",
    title: "Summer Sale",
    subtitle: "Up to 50% Off",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
    bgColor: gradients.hero1[0],
  },
  {
    id: "2",
    title: "New Arrivals",
    subtitle: "Check Out Latest Products",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    bgColor: gradients.hero2[0],
  },
  {
    id: "3",
    title: "Free Shipping",
    subtitle: "On Orders Over $50",
    image:
      "https://unsplash.com/photos/keyboard-object-technology-type-device-button-e2Q_xAeZZSQ",
    bgColor: gradients.hero3[0],
  },
];

// Categories for filter
const categories = [
  { id: "all", name: "All", icon: "grid" },
  { id: "electronics", name: "Electronics", icon: "phone-portrait" },
  { id: "fashion", name: "Fashion", icon: "shirt" },
  { id: "sports", name: "Sports", icon: "fitness" },
  { id: "home", name: "Home", icon: "home" },
];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-slide effect - scrolls every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (currentSlide + 1) % heroSlides.length;
      setCurrentSlide(nextSlide);

      // Programmatically scroll to next slide
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextSlide * SCREEN_WIDTH,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const filteredProducts = moreProducts.filter((product: any) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      query === "" ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleScroll = (e: any) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    if (index >= 0 && index < heroSlides.length && index !== currentSlide) {
      setCurrentSlide(index);
    }
  };

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  return (
    <View style={[styles.container, { backgroundColor: neutral.gray50 }]}>
      {/* Sticky Header - Stays at top */}
      <View style={[styles.header, { backgroundColor: neutral.white }]}>
        <View style={styles.logoCircle}>
          <Image
            source={require("@/assets/logo/elogo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search products..."
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => `product-${item.id}`}
        renderItem={({ item }) => <ProductCard product={item} />}
        numColumns={2}
        extraData={[filteredProducts.length, selectedCategory, query]}
        ListHeaderComponent={
          <>
            {/* Enhanced Hero Section - Auto Sliding Banner */}
            <View style={styles.heroContainer}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={SCREEN_WIDTH - 32}
                snapToAlignment="start"
              >
                {heroSlides.map((slide) => (
                  <View
                    key={slide.id}
                    style={[styles.slide, { backgroundColor: slide.bgColor }]}
                  >
                    <View style={styles.slideContent}>
                      <View style={styles.textContainer}>
                        <Text style={styles.slideTitle}>{slide.title}</Text>
                        <Text style={styles.slideSubtitle}>
                          {slide.subtitle}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.shopNowButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.shopNowText}>Shop Now</Text>
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color={primary.blue}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.imageOverlay} />
                    <Image
                      source={{ uri: slide.image }}
                      style={styles.slideImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Enhanced Pagination Dots */}
              <View style={styles.paginationContainer}>
                <View style={styles.pagination}>
                  {heroSlides.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === currentSlide && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.slideCounter}>
                  {currentSlide + 1} / {heroSlides.length}
                </Text>
              </View>
            </View>

            {/* Categories */}
            <View key="category-filter">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </View>

            {/* Results Count */}
            <View key="results-info" style={styles.resultsInfo}>
              <Text style={styles.resultsText}>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "Product" : "Products"} Found
              </Text>
            </View>
          </>
        }
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 12,
    gap: 12,
    shadowColor: shadows.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: neutral.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: primary.blue,
    shadowColor: shadows.colored,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  heroContainer: {
    width: "100%",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  slide: {
    width: SCREEN_WIDTH - 20,
    height: 220,
    overflow: "hidden",
    position: "relative",
  },
  slideContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: "space-between",
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  slideTitle: {
    fontSize: 38,
    fontWeight: "800",
    color: neutral.white,
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  slideSubtitle: {
    fontSize: 18,
    color: neutral.white,
    opacity: 0.95,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  shopNowButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: neutral.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    alignSelf: "flex-start",
    shadowColor: shadows.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  shopNowText: {
    fontSize: 16,
    fontWeight: "700",
    color: primary.blue,
    marginRight: 8,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    zIndex: 0,
  },
  slideImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 2,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: neutral.white,
    width: 28,
    borderRadius: 4,
  },
  slideCounter: {
    color: neutral.white,
    fontSize: 13,
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: neutral.white,
    borderTopWidth: 1,
    borderTopColor: neutral.gray200,
  },
  resultsText: {
    fontSize: 14,
    color: text.secondary,
    fontWeight: "600",
  },
  productList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
});
