import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Eye, EyeOff, Fingerprint } from 'lucide-react-native';
import { router } from 'expo-router';
import SafeAreaView from '@/components/SafeAreaView';
import { useTheme } from '@/hooks/useTheme';

export default function LoginScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleBiometricLogin = () => {
    Alert.alert(
      'Biometric Authentication',
      'Use your fingerprint or face to login',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Authenticate', onPress: () => router.replace('/(tabs)') },
      ]
    );
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    logoSection: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logo: {
      width: 200,
      height: 80,
      marginBottom: 24,
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    subtitleText: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    formSection: {
      marginBottom: 32,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    passwordInput: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.text,
    },
    eyeButton: {
      padding: 16,
    },
    forgotPassword: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
      textAlign: 'right',
      marginBottom: 32,
    },
    loginButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      elevation: 2,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginHorizontal: 16,
    },
    biometricButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    biometricButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primary,
      marginLeft: 8,
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    signUpText: {
      color: theme.primary,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container} bottomPadding={32}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome to exoBank</Text>
            <Text style={styles.subtitleText}>Sign in to your account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={theme.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Biometric Login */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
            >
              <Fingerprint size={24} color={theme.primary} />
              <Text style={styles.biometricButtonText}>Use Biometric</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <TouchableOpacity onPress={() => router.push('/open-account')}>
                <Text style={styles.signUpText}>Apply Online</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}