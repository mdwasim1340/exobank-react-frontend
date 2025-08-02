import { Tabs } from 'expo-router';
import { Chrome as Home, CreditCard, QrCode, Receipt, User } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    qrIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -20,
      elevation: 4,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      borderWidth: 3,
      borderColor: theme.background,
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          height: 56 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 4),
          paddingTop: 4,
          elevation: 8,
          shadowColor: theme.shadowDark,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ size, color }) => (
            <CreditCard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="qr-scanner"
        options={{
          title: 'QR',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={[
              styles.qrIconContainer,
              { backgroundColor: focused ? theme.primary : theme.surfaceVariant }
            ]}>
              <QrCode size={28} color={focused ? theme.textOnPrimary : color} />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 8,
          },
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ size, color }) => (
            <Receipt size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}