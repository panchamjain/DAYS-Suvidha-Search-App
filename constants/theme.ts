import { DefaultTheme } from 'react-native-paper';

// DAYS Ahmedabad branding colors - Modern palette
export const COLORS = {
  primary: '#1976D2', // Modern blue
  secondary: '#FF6D00', // Vibrant orange
  tertiary: '#43A047', // Fresh green for success/discounts
  background: '#F5F7FA', // Light gray background
  white: '#FFFFFF',
  black: '#000000',
  gray: '#757575',
  lightGray: '#EEEEEE',
  error: '#E53935',
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    white: '#FFFFFF',
  },
  card: {
    background: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  discount: {
    background: '#E8F5E9',
    text: '#2E7D32',
  },
  gradient: {
    primary: ['#1976D2', '#2196F3'],
    secondary: ['#FF6D00', '#FF9800'],
  }
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  xxl: 32,
  xxxl: 40,
  padding: 16,
  radius: 12,
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: 'normal' as 'normal',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: 'bold' as 'bold',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300' as '300',
  },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.card.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.card.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Paper theme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.white,
    text: COLORS.text.primary,
    error: COLORS.error,
  },
};
