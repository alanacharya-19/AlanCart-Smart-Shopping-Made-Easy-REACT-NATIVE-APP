// Primary Colors
export const primary = {
  blue: '#007AFF',      // iOS Blue - Main action color
  purple: '#AF52DE',    // Vibrant Purple - Secondary actions
  pink: '#FF2D55',      // Bright Pink - Highlights, sales
  orange: '#FF9500',    // Energetic Orange - CTAs
  green: '#34C759',     // Success Green - Positive actions
  red: '#FF3B30',       // Bold Red - Alerts, discounts
};

// Neutral Colors
export const neutral = {
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',    // Background light
  gray100: '#F3F4F6',   // Subtle backgrounds
  gray200: '#E5E7EB',   // Borders
  gray300: '#D1D5DB',   // Disabled states
  gray400: '#9CA3AF',   // Placeholder text
  gray500: '#6B7280',   // Secondary text
  gray600: '#4B5563',   // Body text
  gray700: '#374151',   // Headings
  gray800: '#1F2937',   // Primary text
  gray900: '#111827',   // Darkest
};

// Background Colors
export const background = {
  primary: neutral.white,
  secondary: neutral.gray50,
  card: neutral.white,
  input: neutral.gray100,
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Text Colors
export const text = {
  primary: neutral.gray900,
  secondary: neutral.gray600,
  tertiary: neutral.gray400,
  placeholder: neutral.gray400,
  inverse: neutral.white,
  link: primary.blue,
};

// Border Colors
export const border = {
  light: neutral.gray200,
  medium: neutral.gray300,
  dark: neutral.gray400,
  focus: primary.blue,
};

// Status Colors
export const status = {
  success: primary.green,
  error: primary.red,
  warning: primary.orange,
  info: primary.blue,
  sale: primary.pink,
};

// Category-Specific Colors
export const category = {
  electronics: '#007AFF',  // Blue
  fashion: '#FF2D55',      // Pink
  sports: '#34C759',       // Green
  home: '#FF9500',         // Orange
  beauty: '#AF52DE',       // Purple
  books: '#FF6B6B',        // Coral
  toys: '#4ECDC4',         // Teal
  food: '#FFD93D',         // Yellow
};

// Gradient Colors
export const gradients = {
  hero1: ['#FF6B6B', '#FF8E53'],  // Warm sunset
  hero2: ['#4ECDC4', '#45B7D1'],  // Ocean blue
  hero3: ['#A8E063', '#56AB2F'],  // Fresh green
  card: ['#667eea', '#764ba2'],   // Purple gradient
  accent: ['#f093fb', '#f5576c'], // Pink gradient
};

// Shadow Colors
export const shadows = {
  light: 'rgba(0, 0, 0, 0.05)',
  medium: 'rgba(0, 0, 0, 0.1)',
  dark: 'rgba(0, 0, 0, 0.15)',
  colored: 'rgba(0, 122, 255, 0.2)', // Blue-tinted shadow
};

// Opacity Variants
export const opacity = {
  primary5: 'rgba(0, 122, 255, 0.05)',
  primary10: 'rgba(0, 122, 255, 0.1)',
  primary15: 'rgba(0, 122, 255, 0.15)',
  primary20: 'rgba(0, 122, 255, 0.2)',
  
  red5: 'rgba(255, 59, 48, 0.05)',
  red10: 'rgba(255, 59, 48, 0.1)',
  
  green5: 'rgba(52, 199, 89, 0.05)',
  green10: 'rgba(52, 199, 89, 0.1)',
  
  orange5: 'rgba(255, 149, 0, 0.05)',
  orange10: 'rgba(255, 149, 0, 0.1)',
};

// Semantic Color Mappings
export const semantic = {
  // Buttons
  buttonPrimary: primary.blue,
  buttonSecondary: primary.purple,
  buttonSuccess: primary.green,
  buttonDanger: primary.red,
  buttonDisabled: neutral.gray300,
  
  // Badges
  badgeNew: primary.green,
  badgeSale: primary.red,
  badgeHot: primary.orange,
  badgeTrending: primary.pink,
  
  // Ratings
  starFilled: '#FFD700',  // Gold
  starEmpty: neutral.gray300,
  
  // Price
  priceCurrent: primary.blue,
  priceOriginal: neutral.gray400,
  priceDiscount: primary.red,
};
