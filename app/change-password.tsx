import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { ArrowLeft, Eye, EyeOff, Lock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface PasswordRequirement {
  id: string;
  text: string;
  regex: RegExp;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    text: 'At least 8 characters',
    regex: /.{8,}/,
  },
  {
    id: 'uppercase',
    text: 'One uppercase letter',
    regex: /[A-Z]/,
  },
  {
    id: 'lowercase',
    text: 'One lowercase letter',
    regex: /[a-z]/,
  },
  {
    id: 'number',
    text: 'One number',
    regex: /\d/,
  },
  {
    id: 'special',
    text: 'One special character',
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
];

export default function ChangePasswordScreen() {
  const { theme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (password: string) => {
    const metRequirements = passwordRequirements.filter(req => req.regex.test(password));
    const strength = metRequirements.length;
    
    if (strength < 2) return { level: 'Weak', color: theme.error };
    if (strength < 4) return { level: 'Medium', color: theme.warning };
    if (strength === 5) return { level: 'Strong', color: theme.success };
    return { level: 'Weak', color: theme.error };
  };

  const isPasswordValid = (password: string) => {
    return passwordRequirements.every(req => req.regex.test(password));
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (!isPasswordValid(newPassword)) {
      Alert.alert('Error', 'New password does not meet requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Your password has been changed successfully. Please login again with your new password.',
        [
          {
            text: 'OK',
            onPress: () => {
              // In a real app, you would logout the user here
              router.back();
            },
          },
        ]
      );
    }, 2000);
  };

  const passwordStrength = getPasswordStrength(newPassword);

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
    },
    infoCard: {
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      borderLeftWidth: 4,
      borderLeftColor: theme.info,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    inputGroup: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputIcon: {
      paddingLeft: 16,
      paddingRight: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      paddingRight: 12,
      fontSize: 16,
      color: theme.text,
    },
    eyeButton: {
      padding: 16,
    },
    strengthContainer: {
      marginTop: 12,
    },
    strengthHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    strengthLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    strengthLevel: {
      fontSize: 14,
      fontWeight: '600',
    },
    strengthBar: {
      height: 4,
      backgroundColor: theme.border,
      borderRadius: 2,
      marginBottom: 16,
    },
    strengthFill: {
      height: '100%',
      borderRadius: 2,
    },
    requirementsContainer: {
      marginTop: 16,
    },
    requirementsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    requirement: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    requirementIcon: {
      marginRight: 8,
    },
    requirementText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    requirementTextMet: {
      color: theme.success,
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      marginTop: 4,
    },
    changePasswordButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 20,
      elevation: 2,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    changePasswordButtonDisabled: {
      opacity: 0.6,
    },
    changePasswordButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    securityTips: {
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    securityTipsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    securityTip: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
    },
  });

  const isFormValid = currentPassword && 
                     newPassword && 
                     confirmPassword && 
                     isPasswordValid(newPassword) && 
                     newPassword === confirmPassword &&
                     currentPassword !== newPassword;

  const getStrengthWidth = () => {
    const metRequirements = passwordRequirements.filter(req => req.regex.test(newPassword));
    return `${(metRequirements.length / passwordRequirements.length) * 100}%`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Password Security</Text>
          <Text style={styles.infoText}>
            Choose a strong password to keep your account secure. Your new password should be different from your current password and meet all security requirements.
          </Text>
        </View>

        {/* Current Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current Password</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={theme.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff size={20} color={theme.textSecondary} />
              ) : (
                <Eye size={20} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>New Password</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={theme.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff size={20} color={theme.textSecondary} />
              ) : (
                <Eye size={20} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Password Strength */}
          {newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthLabel}>Password Strength</Text>
                <Text style={[styles.strengthLevel, { color: passwordStrength.color }]}>
                  {passwordStrength.level}
                </Text>
              </View>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      backgroundColor: passwordStrength.color,
                      width: getStrengthWidth(),
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password Requirements</Text>
            {passwordRequirements.map((requirement) => {
              const isMet = requirement.regex.test(newPassword);
              return (
                <View key={requirement.id} style={styles.requirement}>
                  <View style={styles.requirementIcon}>
                    {isMet ? (
                      <CheckCircle size={16} color={theme.success} />
                    ) : (
                      <XCircle size={16} color={theme.textSecondary} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.requirementText,
                      isMet && styles.requirementTextMet,
                    ]}
                  >
                    {requirement.text}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm New Password</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={theme.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={theme.textSecondary} />
              ) : (
                <Eye size={20} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          {confirmPassword && newPassword !== confirmPassword && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
        </View>

        {/* Security Tips */}
        <View style={styles.securityTips}>
          <Text style={styles.securityTipsTitle}>Security Tips</Text>
          <Text style={styles.securityTip}>
            • Use a unique password that you don't use for other accounts
          </Text>
          <Text style={styles.securityTip}>
            • Consider using a password manager to generate and store strong passwords
          </Text>
          <Text style={styles.securityTip}>
            • Enable two-factor authentication for additional security
          </Text>
          <Text style={styles.securityTip}>
            • Never share your password with anyone
          </Text>
        </View>

        {/* Change Password Button */}
        <TouchableOpacity
          style={[
            styles.changePasswordButton,
            (!isFormValid || isLoading) && styles.changePasswordButtonDisabled,
          ]}
          onPress={handleChangePassword}
          disabled={!isFormValid || isLoading}
        >
          <Text style={styles.changePasswordButtonText}>
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}