import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTheme } from '@/hooks/useTheme';

interface BottomSafeAreaProps {
  height?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const BottomSafeArea: React.FC<BottomSafeAreaProps> = ({
  height = 20,
  backgroundColor,
  children,
}) => {
  const { theme } = useTheme();
  const { bottomSafeArea } = useSafeArea({ additionalBottom: height });

  return (
    <View
      style={[
        styles.safeArea,
        {
          height: bottomSafeArea,
          backgroundColor: backgroundColor || theme.background,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
});

export default BottomSafeArea;