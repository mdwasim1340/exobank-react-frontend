import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, LogOut, Shield, Smartphone, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function LogoutScreen() {
  const { theme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout? You will need to login again to access your account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Simulate logout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear user session data
      // In a real app, you would:
      // - Clear AsyncStorage/SecureStore
      // - Revoke authentication tokens
      // - Clear any cached user data
      // - Reset app state
      
      // Navigate to login screen
      router.replace('/login');
      
    } catch (error) {
      setIsLoggingOut(false);
      Alert.alert(
        'Logout Failed',
        'Unable to logout at this time. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: performLogout },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      paddingTop: 40,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.error + '20',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
    },
    securityInfo: {
      backgroundColor: theme.surfaceVariant,
      padding: 20,
      borderRadius: 16,
      marginBottom: 32,
    },
    securityTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    securityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    securityIcon: {
      marginRight: 12,
    },
    securityText: {
      fontSize: 14,
      color: theme.textSecondary,
      flex: 1,
      lineHeight: 20,
    },
    buttonContainer: {
      gap: 16,
    },
    logoutButton: {
      backgroundColor: theme.error,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    logoutButtonDisabled: {
      opacity: 0.6,
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginLeft: 8,
    },
    cancelButton: {
      backgroundColor: theme.surfaceVariant,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginLeft: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isLoggingOut}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Logout</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LogOut size={40} color={theme.error} />
        </View>

        <Text style={styles.title}>Logout from exoBank</Text>
        <Text style={styles.subtitle}>
          You're about to logout from your account. Make sure you've completed all your transactions before proceeding.
        </Text>

        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>What happens when you logout:</Text>
          
          <View style={styles.securityItem}>
            <Shield size={20} color={theme.primary} style={styles.securityIcon} />
            <Text style={styles.securityText}>
              Your session will be securely terminated and all cached data will be cleared
            </Text>
          </View>
          
          <View style={styles.securityItem}>
            <Smartphone size={20} color={theme.primary} style={styles.securityIcon} />
            <Text style={styles.securityText}>
              You'll need to login again with your credentials or biometric authentication
            </Text>
          </View>
          
          <View style={styles.securityItem}>
            <Clock size={20} color={theme.primary} style={styles.securityIcon} />
            <Text style={styles.securityText}>
              Any pending transactions will be saved and available when you login again
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              isLoggingOut && styles.logoutButtonDisabled,
            ]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.textOnPrimary} />
                <Text style={styles.loadingText}>Logging out...</Text>
              </View>
            ) : (
              <>
                <LogOut size={20} color={theme.textOnPrimary} />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={isLoggingOut}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}