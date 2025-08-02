import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTheme } from '@/hooks/useTheme';

interface BottomTabBarProps {
  children: React.ReactNode;
  backgroundColor?: string;
  elevation?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  children,
  backgroundColor,
  elevation = 8,
}) => {
  const { theme } = useTheme();
  const { bottomSafeArea, hasBottomInset } = useSafeArea({ additionalBottom: 12 });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: backgroundColor || theme.background,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      paddingBottom: bottomSafeArea,
      paddingTop: 12,
      paddingHorizontal: 16,
      ...Platform.select({
        ios: {
          shadowColor: theme.shadowDark,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation,
        },
        web: {
          boxShadow: `0 -2px 8px ${theme.shadow}`,
        },
      }),
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      minHeight: 56,
    },
    safeAreaIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: hasBottomInset ? 4 : 0,
      backgroundColor: theme.primary,
      opacity: 0.1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.safeAreaIndicator} />
    </View>
  );
};

export default BottomTabBar;