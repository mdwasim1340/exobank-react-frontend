import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useTheme } from '@/hooks/useTheme';

interface SafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  bottomPadding?: number;
  backgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({
  children,
  style,
  bottomPadding = 0,
  backgroundColor,
  edges = ['top', 'bottom', 'left', 'right'],
}) => {
  const { theme } = useTheme();
  const safeArea = useSafeArea({ additionalBottom: bottomPadding });

  const paddingStyle = {
    paddingTop: edges.includes('top') ? safeArea.top : 0,
    paddingBottom: edges.includes('bottom') ? safeArea.bottom : 0,
    paddingLeft: edges.includes('left') ? safeArea.left : 0,
    paddingRight: edges.includes('right') ? safeArea.right : 0,
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || theme.background,
          ...paddingStyle,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaView;