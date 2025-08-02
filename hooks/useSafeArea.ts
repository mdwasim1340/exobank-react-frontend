import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Dimensions } from 'react-native';

interface SafeAreaConfig {
  additionalBottom?: number;
  minBottomPadding?: number;
  adaptToDevice?: boolean;
}

export const useSafeArea = (config: SafeAreaConfig = {}) => {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get('window');
  
  const {
    additionalBottom = 8,
    minBottomPadding = 16,
    adaptToDevice = true
  } = config;

  // Calculate device-specific adjustments
  const getDeviceAdjustment = () => {
    if (!adaptToDevice) return 0;
    
    // iPhone with home indicator typically needs more space
    if (Platform.OS === 'ios' && insets.bottom > 0) {
      return 8;
    }
    
    // Android with gesture navigation
    if (Platform.OS === 'android' && insets.bottom > 0) {
      return 4;
    }
    
    return 0;
  };

  const deviceAdjustment = getDeviceAdjustment();
  
  // Calculate final bottom safe area
  const bottomSafeArea = Math.max(
    insets.bottom + additionalBottom + deviceAdjustment,
    minBottomPadding
  );

  return {
    top: insets.top,
    bottom: bottomSafeArea,
    left: insets.left,
    right: insets.right,
    // Convenience values
    bottomSafeArea,
    hasBottomInset: insets.bottom > 0,
    isLargeScreen: screenHeight > 800,
  };
};

export default useSafeArea;