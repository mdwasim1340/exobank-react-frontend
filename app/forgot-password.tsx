import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ArrowLeft, Mail, Smartphone, CircleCheck as CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateInput = () => {
    if (!emailOrPhone.trim()) {
      Alert.alert('Error', `Please enter your ${contactMethod}`);
      return false;
    }

    if (contactMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrPhone)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return false;
      }
    } else {
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(emailOrPhone)) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return false;
      }
    }

    return true;
  };

  const handleSendResetLink = async () => {
    if (!validateInput()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    router.replace('/login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardView: {
      flex: 1,
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
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    titleSection: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    formSection: {
      marginBottom: 32,
    },
    methodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
    },
    methodOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    methodOptionActive: {
      backgroundColor: theme.primary,
    },
    methodIcon: {
      marginRight: 8,
    },
    methodText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    methodTextActive: {
      color: theme.textOnPrimary,
    },
    inputContainer: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
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
    inputHint: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 8,
      lineHeight: 16,
    },
    sendButton: {
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
    sendButtonDisabled: {
      opacity: 0.6,
    },
    sendButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    backToLoginButton: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    backToLoginText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
    },
    successContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    successIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.success + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    successMessage: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
    successActions: {
      width: '100%',
      gap: 12,
    },
    resendButton: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    resendButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    infoCard: {
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      marginTop: 24,
      borderLeftWidth: 4,
      borderLeftColor: theme.info,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 16,
    },
  });

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Link Sent</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <CheckCircle size={40} color={theme.success} />
            </View>
            
            <Text style={styles.successTitle}>Check Your {contactMethod === 'email' ? 'Email' : 'Phone'}</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to {emailOrPhone}. 
              {contactMethod === 'email' 
                ? ' Please check your email and follow the instructions to reset your password.'
                : ' Please check your SMS and follow the instructions to reset your password.'
              }
            </Text>

            <View style={styles.successActions}>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleBackToLogin}
              >
                <Text style={styles.sendButtonText}>Back to Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setIsSuccess(false);
                  handleSendResetLink();
                }}
              >
                <Text style={styles.resendButtonText}>Resend Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              Enter your registered email or phone number and we'll send you a link to reset your password
            </Text>
          </View>

          <View style={styles.formSection}>
            {/* Contact Method Selector */}
            <View style={styles.methodSelector}>
              <TouchableOpacity
                style={[
                  styles.methodOption,
                  contactMethod === 'email' && styles.methodOptionActive
                ]}
                onPress={() => {
                  setContactMethod('email');
                  setEmailOrPhone('');
                }}
              >
                <Mail 
                  size={16} 
                  color={contactMethod === 'email' ? theme.textOnPrimary : theme.text}
                  style={styles.methodIcon}
                />
                <Text style={[
                  styles.methodText,
                  contactMethod === 'email' && styles.methodTextActive
                ]}>
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodOption,
                  contactMethod === 'phone' && styles.methodOptionActive
                ]}
                onPress={() => {
                  setContactMethod('phone');
                  setEmailOrPhone('');
                }}
              >
                <Smartphone 
                  size={16} 
                  color={contactMethod === 'phone' ? theme.textOnPrimary : theme.text}
                  style={styles.methodIcon}
                />
                <Text style={[
                  styles.methodText,
                  contactMethod === 'phone' && styles.methodTextActive
                ]}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </Text>
              <TextInput
                style={styles.input}
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                placeholder={
                  contactMethod === 'email' 
                    ? 'Enter your email address' 
                    : 'Enter your phone number'
                }
                placeholderTextColor={theme.textSecondary}
                keyboardType={contactMethod === 'email' ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.inputHint}>
                {contactMethod === 'email' 
                  ? 'We\'ll send a reset link to this email address'
                  : 'We\'ll send a reset code to this phone number'
                }
              </Text>
            </View>

            {/* Send Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                isLoading && styles.sendButtonDisabled
              ]}
              onPress={handleSendResetLink}
              disabled={isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Need Help?</Text>
            <Text style={styles.infoText}>
              If you don't receive the reset link within a few minutes, check your spam folder or contact our support team at support@exobank.com
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}