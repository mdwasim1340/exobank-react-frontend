export interface ColorScheme {
  // Primary brand colors from logo
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  
  // Surface and background
  surface: string;
  surfaceVariant: string;
  background: string;
  backgroundSecondary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textOnPrimary: string;
  textOnSurface: string;
  
  // Status colors
  error: string;
  errorVariant: string;
  success: string;
  warning: string;
  info: string;
  
  // Neutral colors
  gray: string;
  lightGray: string;
  border: string;
  shadow: string;
  shadowDark: string;
  overlay: string;
  accent: string;
}

export const LightColors: ColorScheme = {
  // Primary brand colors from logo
  primary: '#2E7D32', // Green
  primaryVariant: '#1B5E20',
  secondary: '#D32F2F', // Red
  secondaryVariant: '#B71C1C',
  
  // Surface and background
  surface: '#FFFFFF',
  surfaceVariant: '#F8F9FA',
  background: '#FFFFFF',
  backgroundSecondary: '#FAFAFA',
  
  // Text colors
  text: '#000000', // Black on white background
  textSecondary: '#757575',
  textOnPrimary: '#FFFFFF', // White on green/colored background
  textOnSurface: '#000000',
  
  // Status colors
  error: '#D32F2F', // Red for errors
  errorVariant: '#CF6679',
  success: '#2E7D32', // Green for success
  warning: '#FF9800',
  info: '#2196F3',
  
  // Neutral colors
  gray: '#9E9E9E',
  lightGray: '#F5F5F5',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.16)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  accent: '#FF4081',
};

export const DarkColors: ColorScheme = {
  // Primary brand colors (slightly adjusted for dark mode)
  primary: '#4CAF50', // Brighter green for better contrast
  primaryVariant: '#2E7D32',
  secondary: '#F44336', // Brighter red for better contrast
  secondaryVariant: '#D32F2F',
  
  // Surface and background
  surface: '#1E1E1E',
  surfaceVariant: '#2D2D2D',
  background: '#121212',
  backgroundSecondary: '#1A1A1A',
  
  // Text colors
  text: '#FFFFFF', // White on dark background
  textSecondary: '#B3B3B3',
  textOnPrimary: '#000000', // Black on bright colors for better contrast
  textOnSurface: '#FFFFFF',
  
  // Status colors (adjusted for dark mode)
  error: '#F44336',
  errorVariant: '#EF5350',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Neutral colors
  gray: '#757575',
  lightGray: '#2D2D2D',
  border: '#404040',
  shadow: 'rgba(255, 255, 255, 0.08)',
  shadowDark: 'rgba(255, 255, 255, 0.16)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  accent: '#FF4081',
};

// Default export for backward compatibility
export const Colors = LightColors;