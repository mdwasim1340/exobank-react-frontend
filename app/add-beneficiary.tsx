import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeft, User, Building, Hash, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function AddBeneficiaryScreen() {
  const { theme } = useTheme();
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [nickname, setNickname] = useState('');

  const handleAddBeneficiary = () => {
    if (!beneficiaryName.trim()) {
      Alert.alert('Error', 'Please enter beneficiary name');
      return;
    }

    if (!accountNumber.trim()) {
      Alert.alert('Error', 'Please enter account number');
      return;
    }

    if (accountNumber !== confirmAccountNumber) {
      Alert.alert('Error', 'Account numbers do not match');
      return;
    }

    if (!ifscCode.trim()) {
      Alert.alert('Error', 'Please enter IFSC code');
      return;
    }

    if (ifscCode.length !== 11) {
      Alert.alert('Error', 'IFSC code must be 11 characters');
      return;
    }

    Alert.alert(
      'Confirm Beneficiary',
      `Add ${beneficiaryName} as beneficiary?\n\nAccount: ${accountNumber}\nIFSC: ${ifscCode}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => {
            Alert.alert('Success', 'Beneficiary added successfully!');
            router.back();
          }
        },
      ]
    );
  };

  const handleIFSCLookup = () => {
    if (ifscCode.length === 11) {
      // Simulate IFSC lookup
      const bankNames = {
        'HDFC': 'HDFC Bank',
        'ICIC': 'ICICI Bank',
        'SBIN': 'State Bank of India',
        'AXIS': 'Axis Bank',
        'PUNB': 'Punjab National Bank',
      };
      
      const bankCode = ifscCode.substring(0, 4);
      const foundBank = bankNames[bankCode as keyof typeof bankNames];
      
      if (foundBank) {
        setBankName(foundBank);
        Alert.alert('Bank Found', `Bank: ${foundBank}`);
      } else {
        Alert.alert('Bank Not Found', 'Please verify the IFSC code');
      }
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
    form: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
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
      paddingRight: 16,
      fontSize: 16,
      color: theme.text,
    },
    ifscContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ifscInput: {
      flex: 1,
      paddingVertical: 16,
      paddingRight: 12,
      fontSize: 16,
      color: theme.text,
      textTransform: 'uppercase',
    },
    lookupButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.primary,
      borderRadius: 8,
      marginRight: 12,
    },
    lookupButtonText: {
      fontSize: 12,
      color: theme.textOnPrimary,
      fontWeight: '600',
    },
    bankNameDisplay: {
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 8,
    },
    bankNameText: {
      fontSize: 14,
      color: theme.textOnPrimary,
      fontWeight: '500',
    },
    helpText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
      lineHeight: 16,
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      marginTop: 4,
    },
    addButton: {
      backgroundColor: theme.primary,
      marginHorizontal: 20,
      marginBottom: 20,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      elevation: 2,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    infoCard: {
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 20,
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

  const isFormValid = beneficiaryName.trim() && 
                     accountNumber.trim() && 
                     confirmAccountNumber.trim() && 
                     accountNumber === confirmAccountNumber &&
                     ifscCode.trim() && 
                     ifscCode.length === 11;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Beneficiary</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Beneficiary Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Beneficiary Name *</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color={theme.textSecondary} />
              </View>
              <TextInput
                style={styles.input}
                value={beneficiaryName}
                onChangeText={setBeneficiaryName}
                placeholder="Enter full name as per bank account"
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Account Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Number *</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Hash size={20} color={theme.textSecondary} />
              </View>
              <TextInput
                style={styles.input}
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Enter account number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Confirm Account Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Account Number *</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Hash size={20} color={theme.textSecondary} />
              </View>
              <TextInput
                style={styles.input}
                value={confirmAccountNumber}
                onChangeText={setConfirmAccountNumber}
                placeholder="Re-enter account number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>
            {confirmAccountNumber && accountNumber !== confirmAccountNumber && (
              <Text style={styles.errorText}>Account numbers do not match</Text>
            )}
          </View>

          {/* IFSC Code */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>IFSC Code *</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Building size={20} color={theme.textSecondary} />
              </View>
              <View style={styles.ifscContainer}>
                <TextInput
                  style={styles.ifscInput}
                  value={ifscCode}
                  onChangeText={(text) => setIfscCode(text.toUpperCase())}
                  placeholder="Enter IFSC code"
                  placeholderTextColor={theme.textSecondary}
                  maxLength={11}
                  autoCapitalize="characters"
                />
                {ifscCode.length === 11 && (
                  <TouchableOpacity
                    style={styles.lookupButton}
                    onPress={handleIFSCLookup}
                  >
                    <Text style={styles.lookupButtonText}>Verify</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={styles.helpText}>
              IFSC code is an 11-character code that identifies the bank branch
            </Text>
            {bankName && (
              <View style={styles.bankNameDisplay}>
                <Text style={styles.bankNameText}>Bank: {bankName}</Text>
              </View>
            )}
          </View>

          {/* Nickname (Optional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nickname (Optional)</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <MapPin size={20} color={theme.textSecondary} />
              </View>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="e.g., John's Savings"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            <Text style={styles.helpText}>
              Add a nickname to easily identify this beneficiary
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • Ensure all details are correct as per the beneficiary's bank account{'\n'}
            • IFSC code helps identify the exact bank branch{'\n'}
            • Added beneficiaries will be verified before first transfer{'\n'}
            • You can add up to 50 beneficiaries
          </Text>
        </View>
      </ScrollView>

      {/* Add Beneficiary Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          !isFormValid && styles.addButtonDisabled
        ]}
        onPress={handleAddBeneficiary}
        disabled={!isFormValid}
      >
        <Text style={styles.addButtonText}>Add Beneficiary</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}